const moment = require('moment');
const Trip = require('../models/Trip'); // Assuming your Trip model is in 'models/Trip'
const Route = require('../models/Route'); // Assuming your Route model is in 'models/Route'
const Bus = require('../models/Bus'); // Assuming your Bus model is in 'models/Bus'

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
