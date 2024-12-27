const moment = require('moment');
const Trip = require('../models/Trip');
const Route = require('../models/Route'); 
const Bus = require('../models/Bus');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

//search buses with departure station,arrival station and date by commuter 
const searchBuses = async (req, res) => {
  try {
    // Get the commuter's search parameters from the query string
    const { departureStation, arrivalStation, date } = req.query;

    // Convert the date to a valid Date object
    const searchDate = moment(date).startOf('day').toDate();

    // Fetch trips matching the search criteria
    const trips = await Trip.find({
      'routeNumber.startPoint': departureStation,
      'routeNumber.endPoint': arrivalStation,
      date: searchDate,
      status: 'Scheduled' // Ensure only scheduled trips are returned
    })
      .populate('routeNumber') // Populate the route details (e.g., startPoint, endPoint)
      .populate('busNumber'); // Populate bus details (e.g., busName, busType)

    if (trips.length === 0) {
      return res.status(404).json({ message: 'No buses found for the selected criteria.' });
    }

    // Format the trips to return only the relevant details
    const tripDetails = trips.map(trip => ({
      departureStation: trip.routeNumber.startPoint, // Get departure station from Route
      arrivalStation: trip.routeNumber.endPoint, // Get arrival station from Route
      date: trip.date, // The date of the trip
      busName: trip.busNumber.busName, // Bus name from Bus model
      busType: trip.busNumber.busType, // Bus type from Bus model
      routeNumber: trip.routeNumber.routeNumber, // Route number from Route model
      departureTime: trip.departureTime, // Departure time of the trip
      arrivalTime: trip.arrivalTime, // Arrival time of the trip
      price: trip.price, // Price for the trip
      availableSeats: trip.seatAvailability.available.length, // Count available seats
      closingDateTime: moment(trip.date).set({ hour: 18, minute: 0 }).toISOString() // Example closing time for booking
    }));

    // Return the formatted trips
    res.json({
      success: true,
      trips: tripDetails,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//Sort the buses by fare , departure, arrival, seatAvailability and name by commuter 
exports.sortBuses = async (req, res) => {
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

// View the selected bus seats by commuter 
exports.viewSeats = async (req, res) => {
    const { tripId } = req.params;
  
    try {
      // Fetch the trip by ID
      const trip = await Trip.findById(tripId);
  
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
  
      // Prepare the seat matrix
      const totalSeats = trip.seatAvailability.totalSeats;
      const rows = Math.ceil(totalSeats / 4); // Assuming 4 seats per row
      const seatMatrix = [];
  
      // Generate seat matrix row by row
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 1; j <= 4; j++) {
          const seatNumber = i * 4 + j;
          if (seatNumber > totalSeats) break;
  
          // Determine the seat status
          let status = 'available'; // Default status
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
  
      // Send response
      res.status(200).json({ seatMatrix });
    } catch (error) {
      console.error('Error fetching seats:', error);
      res.status(500).json({ message: 'Error fetching seats', error });
    }
  };
  
// making a booking or reserving a seat in a bus by commuter 
const sendEmail = require('../utils/email');
const sendSMS = require('../utils/sms');

exports.bookSeat = async (req, res) => {
  const { tripId, passengerName, mobileNumber, email, seatNumber, boardingPlace, destinationPlace, totalPrice } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (!trip.seatAvailability.available.includes(seatNumber)) {
      return res.status(400).json({ message: 'Seat not available' });
    }

    // Mark seat as in-progress
    trip.seatAvailability.available = trip.seatAvailability.available.filter(seat => seat !== seatNumber);
    trip.seatAvailability.bookingInProgress.push(seatNumber);
    await trip.save();

    // Create booking
    const booking = new Booking({
      tripId,
      passengerName,
      mobileNumber,
      email,
      seatNumber,
      boardingPlace,
      destinationPlace,
      totalPrice,
      status: 'Confirmed', // Still pending payment
    });

    await booking.save();

    // Finalize seat status
    trip.seatAvailability.bookingInProgress = trip.seatAvailability.bookingInProgress.filter(seat => seat !== seatNumber);
    trip.seatAvailability.alreadyBooked.push(seatNumber);
    await trip.save();

    res.status(200).json({
      message: 'Seat reserved. Proceed to payment.',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error booking seat', error });
  }
};

//making payments for the booking by the commuter 
exports.processPayment = async (req, res) => {
    const { bookingId, paymentMethod, cardDetails } = req.body;
  
    try {
      // Validate booking
      const booking = await Booking.findById(bookingId).populate('tripId');
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
  
      // Ensure booking is valid for payment
      if (booking.status !== 'Confirmed') {
        return res.status(400).json({ message: 'Booking is not in a valid state for payment' });
      }
  
      // Mock payment processing
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
      // Create Payment entry
      const payment = new Payment({
        bookingId,
        amount: booking.totalPrice,
        paymentMethod,
        cardDetails: {
          nameOnCard: cardDetails.nameOnCard,
          cardNumber: cardDetails.cardNumber,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv
        },
        status: 'Successful',
        transactionId
      });
      await payment.save();
  
      // Update booking status to Paid
      booking.status = 'Paid';
      await booking.save();
  
      // Send confirmation email and SMS
      const trip = booking.tripId;
      const emailContent = `
        Payment Successful!
        Booking Details:
        - Bus Name: ${trip.busName}
        - Bus Number: ${trip.busNumber}
        - Seat Number: ${booking.seatNumber}
        - Departure: ${trip.departureTime}
        - Arrival: ${trip.arrivalTime}
        Payment Details:
        - Total Amount: ${booking.totalPrice}
        - Payment Date: ${payment.paymentDate}
        - Reference Number: ${transactionId}
      `;
      await sendEmail(booking.email, 'Booking Payment Confirmation', emailContent);
  
      const smsContent = `Payment successful for booking seat ${booking.seatNumber} on ${trip.busName} (${trip.busNumber}). Departure: ${trip.departureTime}. Amount: ${booking.totalPrice}. Reference: ${transactionId}`;
      await sendSMS(booking.mobileNumber, smsContent);
  
      // Respond with payment details
      res.status(200).json({
        message: 'Payment successful',
        payment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error processing payment', error });
    }
  };



//Cancelling a booking or reserved seat in a bus by commuter 
const sendEmail = require('../utils/email');
const sendSMS = require('../utils/sms');

exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId).populate('tripId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const trip = await Trip.findById(booking.tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Update seat availability
    trip.seatAvailability.alreadyBooked = trip.seatAvailability.alreadyBooked.filter(seat => seat !== booking.seatNumber);
    trip.seatAvailability.available.push(booking.seatNumber);
    await trip.save();

    // Update booking status
    booking.status = 'Canceled';
    await booking.save();

    // Create email content
    const emailContent = `
      Booking Canceled!
      - Bus Name: ${trip.busName}
      - Bus Number: ${trip.busNumber}
      - Seat Number: ${booking.seatNumber}
      - Departure Time: ${trip.departureTime}
      - Arrival Time: ${trip.arrivalTime}
    `;
    await sendEmail(booking.email, 'Booking Cancellation', emailContent);

    // Create SMS content
    const smsContent = `Booking canceled! 
    Bus: ${trip.busName} (${trip.busNumber}), 
    Seat: ${booking.seatNumber}, 
    Departure: ${trip.departureTime}, 
    Arrival: ${trip.arrivalTime}.`;
    await sendSMS(booking.mobileNumber, smsContent);

    // Respond to the client
    res.status(200).json({ message: 'Booking canceled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error });
  }
};

