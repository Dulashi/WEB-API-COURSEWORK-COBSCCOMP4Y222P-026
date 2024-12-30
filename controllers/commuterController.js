const moment = require('moment');
const Trip = require('../models/Trip');
const Route = require('../models/Route'); 
const Bus = require('../models/Bus');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// Search buses with departure station, arrival station, and date by commuter
const searchBuses = async (req, res) => {
  try {
    const { departureStation, arrivalStation, date } = req.query;
    const searchDate = moment(date).toDate();

    const startOfDay = moment(searchDate).startOf('day').toDate();
    const endOfDay = moment(searchDate).endOf('day').toDate();

    // Find trips based on routeNumber and busNumber as strings
    const trips = await Trip.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'Scheduled'
    });

    // Get matching routes
    const routes = await Route.find({
      startPoint: departureStation,
      endPoint: arrivalStation
    });

    // Filter trips that match the routes
    const filteredTrips = trips.filter(trip =>
      routes.some(route => route.routeNumber === trip.routeNumber)
    );

    if (filteredTrips.length === 0) {
      return res.status(404).json({ message: 'No buses found for the selected criteria.' });
    }

    // Map route and bus details into the response
    const tripDetails = await Promise.all(
      filteredTrips.map(async trip => {
        const route = routes.find(r => r.routeNumber === trip.routeNumber);
        const bus = await Bus.findOne({ busNumber: trip.busNumber });

        return {
          departureStation: route.startPoint,
          arrivalStation: route.endPoint,
          date: trip.date,
          busName: bus.busName,
          busType: bus.busType,
          routeNumber: trip.routeNumber,
          departureTime: trip.departureTime,
          arrivalTime: trip.arrivalTime,
          price: trip.price,
          availableSeats: trip.seatAvailability.available.length,
          closingDateTime: moment(trip.date).set({ hour: 18, minute: 0 }).toISOString()
        };
      })
    );

    res.json({ success: true, trips: tripDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// Sort buses by criteria (fare, departure, arrival, seat availability, name)
const sortBuses = async (req, res) => {
    const { criteria } = req.query;
    try {
        const trips = await Trip.find().populate('busNumber routeNumber');
        let sortedTrips;

        switch (criteria) {
            case 'fare':
                sortedTrips = trips.sort((a, b) => a.price - b.price);
                break;
            case 'departure':
                sortedTrips = trips.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
                break;
            case 'arrival':
                sortedTrips = trips.sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));
                break;
            case 'seatAvailability':
                sortedTrips = trips.sort((a, b) => b.seatAvailability.available.length - a.seatAvailability.available.length);
                break;
            case 'name':
                sortedTrips = trips.sort((a, b) => a.busNumber.busName.localeCompare(b.busNumber.busName));
                break;
            default:
                return res.status(400).json({ message: 'Invalid criteria' });
        }

        res.status(200).json(sortedTrips);
    } catch (error) {
        res.status(500).json({ message: 'Error sorting buses', error });
    }
};

// View seats in a selected bus
const viewSeats = async (req, res) => {
  const { tripId } = req.params;
  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const totalSeats = trip.seatAvailability.totalSeats;
    const rows = Math.ceil(totalSeats / 4); 
    const seatMatrix = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 1; j <= 4; j++) {
        const seatNumber = i * 4 + j;
        if (seatNumber > totalSeats) break;

        let status = 'available';
        if (trip.seatAvailability.availableForLadies.includes(seatNumber)) {
          status = 'ladies-only';
        } else if (trip.seatAvailability.notProvided.includes(seatNumber)) {
          status = 'not-provided';
        } else if (trip.seatAvailability.bookingInProgress.includes(seatNumber)) {
          status = 'booking-in-progress';
        } else if (trip.seatAvailability.alreadyBooked.includes(seatNumber)) {
          status = 'already-booked';
        }

        row.push({ seatNumber, status });
      }
      seatMatrix.push(row);
    }

    res.status(200).json({ seatMatrix });
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ message: 'Error fetching seats', error });
  }
};

// Book a seat for the commuter
const bookSeat = async (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  console.log('User object:', user); // Debugging user object

  const { tripId, passengerName, mobileNumber, email, seatNumber, boardingPlace, destinationPlace, totalPrice } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (!trip.seatAvailability.available.includes(seatNumber)) {
      return res.status(400).json({ message: 'Seat not available' });
    }

    trip.seatAvailability.available = trip.seatAvailability.available.filter(seat => seat !== seatNumber);
    trip.seatAvailability.bookingInProgress.push(seatNumber);
    await trip.save();

    const booking = new Booking({
      userId: user.id, // Use user.id instead of user._id
      tripId,
      passengerName,
      mobileNumber,
      email,
      seatNumber,
      boardingPlace,
      destinationPlace,
      totalPrice,
      status: 'Confirmed',
    });

    await booking.save();

    trip.seatAvailability.bookingInProgress = trip.seatAvailability.bookingInProgress.filter(seat => seat !== seatNumber);
    trip.seatAvailability.alreadyBooked.push(seatNumber);
    await trip.save();

    res.status(200).json({ message: 'Seat reserved. Proceed to payment.', booking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Error booking seat', error });
  }
};

// Process the payment for the booking
const processPayment = async (req, res) => {
  const { bookingId, paymentMethod, cardDetails } = req.body;
  try {
    const booking = await Booking.findById(bookingId).populate('tripId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status !== 'Confirmed') {
      return res.status(400).json({ message: 'Booking is not in a valid state for payment' });
    }

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payment = new Payment({
      bookingId,
      amount: booking.totalPrice,
      paymentMethod,
      cardDetails: { ...cardDetails },
      status: 'Successful',
      transactionId,
    });
    await payment.save();

    // Generate Booking Token after payment
    const bookingToken = crypto.randomBytes(16).toString('hex');
    booking.bookingToken = bookingToken;
    await booking.save();

    const emailContent = `
      Payment Successful for your booking! 
      Seat Number: ${booking.seatNumber}, 
      Bus Number: ${booking.tripId.busNumber}, 
      Boarding Place: ${booking.boardingPlace}, 
      Destination Place: ${booking.destinationPlace}.
      Your Booking Token: ${bookingToken}.
    `;
    await sendEmail(booking.email, 'Booking Payment Confirmation', emailContent);

    res.status(200).json({ message: 'Payment successful', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  const { user } = req;
  const { bookingId, bookingToken, otp } = req.body;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  try {
    const booking = await Booking.findById(bookingId).populate('tripId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking.' });
    }

    if (booking.bookingToken !== bookingToken) {
      return res.status(400).json({ message: 'Invalid booking token.' });
    }

    // Simulate OTP check
    const generatedOTP = otp; // In real scenarios, validate OTP from a third-party service
    if (generatedOTP !== '123456') { // This should be replaced with real OTP generation and validation
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    const trip = await Trip.findById(booking.tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    trip.seatAvailability.alreadyBooked = trip.seatAvailability.alreadyBooked.filter(
      (seat) => seat !== booking.seatNumber
    );
    trip.seatAvailability.available.push(booking.seatNumber);
    await trip.save();

    booking.status = 'Canceled';
    await booking.save();

    const emailContent = `
      Booking Canceled!
      Seat Number: ${booking.seatNumber}, 
      Bus Number: ${booking.tripId.busNumber}, 
      Boarding Place: ${booking.boardingPlace}, 
      Destination Place: ${booking.destinationPlace}.
    `;
    await sendEmail(booking.email, 'Booking Cancellation', emailContent);

    res.status(200).json({ message: 'Booking canceled successfully', booking });
  } catch (error) {
    console.error('Error canceling booking:', error); // Enhanced error logging
    res.status(500).json({ message: 'Error canceling booking', error: error.message || error });
  }
};

// View own bookings (Commuter)
const viewOwnBookings = async (req, res) => {
  try {
    const { user } = req; // Assuming req.user contains logged-in user data
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const bookings = await Booking.find({ userId: user._id }).populate('tripId');
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found.' });
    }

    const bookingDetails = bookings.map(booking => ({
      tripId: booking.tripId._id,
      busName: booking.tripId.busNumber.busName,
      route: `${booking.tripId.routeNumber.startPoint} to ${booking.tripId.routeNumber.endPoint}`,
      departureTime: booking.tripId.departureTime,
      seatNumber: booking.seatNumber,
      status: booking.status,
      bookingDate: booking.createdAt,
    }));

    res.status(200).json({ success: true, bookings: bookingDetails });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

module.exports = {
  searchBuses,
  sortBuses,
  viewSeats,
  bookSeat,
  processPayment,
  cancelBooking,
  viewOwnBookings, 
};