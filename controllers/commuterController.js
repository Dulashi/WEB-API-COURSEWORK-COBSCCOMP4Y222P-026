const moment = require('moment');
const Trip = require('../models/Trip');
const Route = require('../models/Route'); 
const Bus = require('../models/Bus');

//search buses with departure station,arrival station and date
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

//Sort the buses by fare , departure, arrival, seatAvailability and name 
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

// View the selected bus seats 
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
  
