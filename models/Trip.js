const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  routeNumber: { 
    type: String,  // Storing as a string
    required: true
  },
  busNumber: { 
    type: String,  // Storing as a string
    required: true
  },
  date: { 
    type: Date, 
    required: true 
  },
  departureTime: { 
    type: Date, 
    required: true 
  },
  arrivalTime: { 
    type: Date, 
    required: true 
  },
  seatAvailability: {
    totalSeats: { type: Number, required: true },
    availableForLadies: [{ type: Number }],
    notProvided: [{ type: Number }],
    bookingInProgress: [{ type: Number }],
    available: [{ type: Number }],
    alreadyBooked: [{ type: Number }]
  },
  price: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    default: 'Scheduled' 
  } 
});

module.exports = mongoose.model('Trip', TripSchema);