const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { 
    type: Number, 
    required: true 
},
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['Debit', 'Credit', 'Bank Transfer'] 
  },
  status: { 
    type: String, 
    default: 'Pending' // E.g., Pending, Successful, Failed
}, 
  transactionId: { 
    type: String   // For tracking online payments
}, 
  paymentDate: { 
    type: Date, 
    default: Date.now }
},);

module.exports = mongoose.model('Payment', PaymentSchema);
