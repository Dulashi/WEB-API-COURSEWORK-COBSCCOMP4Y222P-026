const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const sendEmail = require('../utils/email');
const sendSMS = require('../utils/sms');

 //View all bookings for a specific trip
exports.getBookingsByTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    // Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Fetch all bookings for the trip
    const bookings = await Booking.find({ tripId }).populate('userId', 'name email');

    res.status(200).json({ message: 'Bookings retrieved successfully', bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};


 //Cancel a booking on behalf of a commuter in case if the commuter is unable to cancel the booking
exports.adminCancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    // Find the booking and populate the trip
    const booking = await Booking.findById(bookingId).populate('tripId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const trip = booking.tripId;
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Update trip seat availability
    trip.seatAvailability.alreadyBooked = trip.seatAvailability.alreadyBooked.filter(
      seat => seat !== booking.seatNumber
    );
    trip.seatAvailability.available.push(booking.seatNumber);
    await trip.save();

    // Update booking status
    booking.status = 'Canceled';
    await booking.save();

    // Notify commuter via email and SMS
    const emailContent = `
      Your booking has been canceled by the administrator.
      - Bus Name: ${trip.busName}
      - Bus Number: ${trip.busNumber}
      - Seat Number: ${booking.seatNumber}
      - Departure: ${trip.departureTime}
      - Arrival: ${trip.arrivalTime}
    `;
    await sendEmail(booking.email, 'Booking Cancellation Notification', emailContent);

    const smsContent = `Your booking for seat ${booking.seatNumber} on ${trip.busName} (${trip.busNumber}) has been canceled by the admin. Departure: ${trip.departureTime}, Arrival: ${trip.arrivalTime}`;
    await sendSMS(booking.mobileNumber, smsContent);

    res.status(200).json({ message: 'Booking canceled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error });
  }
};
