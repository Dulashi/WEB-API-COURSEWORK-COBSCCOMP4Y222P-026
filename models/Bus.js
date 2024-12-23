const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    busNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    busName: { 
        type: String, 
        required: true
     },
    busType: { 
        type: String, 
        required: true 
    },
    permitNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Operator', required: true }
  },);
  
  module.exports = mongoose.model('Bus', BusSchema);
