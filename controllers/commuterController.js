const moment = require('moment');
const Trip = require('../models/Trip');
const Route = require('../models/Route'); 
const Bus = require('../models/Bus');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const sendEmail = require('../utils/email');
const sendSMS = require('../utils/sms');

// Search buses with departure station, arrival station, and date by commuter
const searchBuses = async (req, res) => {
  try {
    const { departureStation, arrivalStation, date } = req.query;
    const searchDate = moment(date).startOf('day').toDate();

    const trips = await Trip.find({
      'routeNumber.startPoint': departureStation,
      'routeNumber.endPoint': arrivalStation,
      date: searchDate,
      status: 'Scheduled'
    })
    .populate('routeNumber')
    .populate('busNumber');

    if (trips.length === 0) {
      return res.status(404).json({ message: 'No buses found for the selected criteria.' });
    }

    const tripDetails = trips.map(trip => ({
      departureStation: trip.routeNumber.startPoint,
      arrivalStation: trip.routeNumber.endPoint,
      date: trip.date,
      busName: trip.busNumber.busName,
      busType: trip.busNumber.busType,
      routeNumber: trip.routeNumber.routeNumber,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      price: trip.price,
      availableSeats: trip.seatAvailability.available.length,
      closingDateTime: moment(trip.date).set({ hour: 18, minute: 0 }).toISOString()
    }));

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

    booking.status = 'Paid';
    await booking.save();

    const emailContent = `Payment Successful for booking ${booking.seatNumber}`;
    await sendEmail(booking.email, 'Booking Payment Confirmation', emailContent);

    const smsContent = `Payment successful for booking seat ${booking.seatNumber}. Amount: ${booking.totalPrice}. Reference: ${transactionId}`;
    await sendSMS(booking.mobileNumber, smsContent);

    res.status(200).json({ message: 'Payment successful', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId).populate('tripId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const trip = await Trip.findById(booking.tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    trip.seatAvailability.alreadyBooked = trip.seatAvailability.alreadyBooked.filter(seat => seat !== booking.seatNumber);
    trip.seatAvailability.available.push(booking.seatNumber);
    await trip.save();

    booking.status = 'Canceled';
    await booking.save();

    const emailContent = `Booking Canceled for seat ${booking.seatNumber}`;
    await sendEmail(booking.email, 'Booking Cancellation', emailContent);

    const smsContent = `Booking canceled for seat ${booking.seatNumber}. Departure: ${trip.departureTime}. Arrival: ${trip.arrivalTime}.`;
    await sendSMS(booking.mobileNumber, smsContent);

    res.status(200).json({ message: 'Booking canceled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error });
  }
};

module.exports = {
  searchBuses,
  sortBuses,
  viewSeats,
  bookSeat,
  processPayment,
  cancelBooking,
};
