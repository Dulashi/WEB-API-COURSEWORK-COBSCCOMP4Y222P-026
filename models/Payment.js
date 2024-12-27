const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['Visa/Mastercard', 'American Express'] // Updated to reflect payment methods
  },
  cardDetails: {
    nameOnCard: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true }, // MM/YY format
    cvv: { type: String, required: true }
  },
  status: { 
    type: String, 
    default: 'Pending', // E.g., Pending, Successful, Failed
    enum: ['Pending', 'Successful', 'Failed']
  }, 
  transactionId: { 
    type: String, // For tracking mock online payments
    unique: true
  }, 
  paymentDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
