const Trip = require('../models/Trip');

exports.addTrip = async (req, res) => {
    try {
        const { routeNumber, busNumber, date, departureTime, arrivalTime, seatAvailability, price, status } = req.body;
        const newTrip = new Trip({ routeNumber, busNumber, date, departureTime, arrivalTime, seatAvailability, price, status });
        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTrip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(200).json(updatedTrip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const canceledTrip = await Trip.findByIdAndUpdate(id, { status: 'Canceled' }, { new: true });
        if (!canceledTrip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(200).json({ message: "Trip canceled successfully", trip: canceledTrip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
