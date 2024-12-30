const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
    routeNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    startPoint: { 
        type: String, 
        required: true 
    },
    endPoint: { 
        type: String, 
        required: true 
    },
    distance: { 
        type: Number, 
        required: true }
  },);
  
  module.exports = mongoose.model('Route', RouteSchema);