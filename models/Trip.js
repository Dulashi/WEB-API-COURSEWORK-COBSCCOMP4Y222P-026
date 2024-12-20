const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  routeNumber: { 
    type: String, 
    required: true, 
    ref: 'Route' // Refers to the routeNumber in Route schema
  },
  busNumber: { 
    type: String, 
    required: true, 
    ref: 'Bus' // Refers to the busNumber in Bus schema
  },
  date: { 
    type: Date, 
    required: true 
  }, // Date of the trip
  departureTime: { 
    type: Date, 
    required: true 
  },
  arrivalTime: { 
    type: Date, 
    required: true 
  },
  seatAvailability: {
    totalSeats: { 
      type: Number, 
      required: true 
    },
    availableForLadies: [{ 
      type: Number 
    }], // Array of seat numbers for ladies
    notProvided: [{ 
      type: Number 
    }], // Array of seat numbers not provided
    bookingInProgress: [{ 
      type: Number 
    }], // Array of seat numbers being booked
    available: [{ 
      type: Number 
    }], // Array of available seat numbers
    alreadyBooked: [{ 
      type: Number 
    }] // Array of already booked seat numbers
  },
  price: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    default: 'Scheduled' 
  } 
},);

module.exports = mongoose.model('Trip', TripSchema);
