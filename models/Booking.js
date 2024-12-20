const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user making the booking
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  passengerName: { 
    type: String, 
    required: true 
},
  mobileNumber: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true
},
  seatNumber: { 
    type: Number, required: true 
}, 
  boardingPlace: { 
    type: String, required: true 
},
  destinationPlace: { 
    type: String, required: true 
},
  totalPrice: { 
    type: Number, 
    required: true 
},
  status: { 
    type: String, 
    default: 'Pending' } 
},);

module.exports = mongoose.model('Booking', BookingSchema);
