const Bus = require('../models/Bus');

exports.addBus = async (req, res) => {
    try {
        const buses = Array.isArray(req.body) ? req.body : [req.body];

        const savedBuses = await Promise.all(
            buses.map(async (busData) => {
                const { busNumber, busName, busType, permitNumber, operatorId } = busData;
                const newBus = new Bus({ busNumber, busName, busType, permitNumber, operatorId });
                return await newBus.save();
            })
        );

        res.status(201).json({ message: 'Buses added successfully', data: savedBuses });
    } catch (error) {
        res.status(500).json({ message: 'Error adding buses', error: error.message });
    }
};

exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find();
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBusByPermitNo = async (req, res) => {
    try {
        const { permitNo } = req.params;
        const bus = await Bus.findOne({ permitNumber: permitNo });
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        res.status(200).json(bus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBusByBusNumber = async (req, res) => {
    try {
        const { busNumber } = req.params;
        const bus = await Bus.findOne({ busNumber: busNumber });
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        res.status(200).json(bus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBusDetails = async (req, res) => {
    try {
        const { busNumber } = req.params;
        const updatedBus = await Bus.findOneAndUpdate({ busNumber }, req.body, { new: true });
        if (!updatedBus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        res.status(200).json(updatedBus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBus = async (req, res) => {
    try {
        const { busNumber } = req.params;
        const deletedBus = await Bus.findOneAndDelete({ busNumber });
        if (!deletedBus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        res.status(200).json({ message: "Bus deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
