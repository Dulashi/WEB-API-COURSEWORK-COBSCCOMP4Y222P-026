const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  password: { type: String, required: true }, // Hashed password
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
 
});

module.exports = mongoose.model('Operator', operatorSchema);
