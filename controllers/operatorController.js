// In operatorController.js
const bcrypt = require('bcrypt');
const Operator = require('../models/Operator');

// Register a new operator
const registerOperator = async (req, res) => {
    try {
        const { name, email, phone, companyName, licenseNumber, password, confirmPassword } = req.body;

        // Validate password and confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        // Check if the operator already exists
        const existingOperator = await Operator.findOne({ email });
        if (existingOperator) {
            return res.status(400).json({ message: 'Operator with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new operator
        const operator = new Operator({
            name,
            email,
            phone,
            companyName,
            licenseNumber,
            password: hashedPassword, // Store the hashed password
            status: 'Pending',
        });

        await operator.save();
        res.status(201).json({ message: 'Registration successful. Awaiting admin approval.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all operators
const getAllOperators = async (req, res) => {
    try {
        // Fetch all operators
        const operators = await Operator.find();
        res.status(200).json(operators);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching operators', error: error.message });
    }
};

// Get operator by ID
const getOperatorById = async (req, res) => {
    const { id } = req.params;
    try {
        const operator = await Operator.findById(id);
        if (!operator) {
            return res.status(404).json({ message: 'Operator not found.' });
        }
        res.status(200).json(operator);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching operator', error: error.message });
    }
};

// Delete operator by ID
const deleteOperatorById = async (req, res) => {
    const { id } = req.params;
    try {
        const operator = await Operator.findByIdAndDelete(id);
        if (!operator) {
            return res.status(404).json({ message: 'Operator not found.' });
        }
        res.status(200).json({ message: 'Operator deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting operator', error: error.message });
    }
};

const getPendingOperators = async (req, res) => {
    try {
        // Fetch all operators with a 'pending' status (adjust based on your model)
        const pendingOperators = await Operator.find({ status: 'Pending' });
        res.status(200).json(pendingOperators);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending operators', error: error.message });
    }
};

const manageOperatorStatus = async (req, res) => {
    const { id } = req.params; // Get the operator ID from the URL
    const { status } = req.body; // The new status (e.g., 'approved', 'rejected')

    try {
        // Find the operator by ID and update their status
        const operator = await Operator.findById(id);
        if (!operator) {
            return res.status(404).json({ message: 'Operator not found.' });
        }

        // Update the status
        operator.status = status;

        // Save the updated operator
        await operator.save();
        res.status(200).json({ message: 'Operator status updated successfully.', operator });
    } catch (error) {
        res.status(500).json({ message: 'Error updating operator status', error: error.message });
    }
};


// Get all buses owned by the logged-in operator
const getOwnedBuses = async (req, res) => {
    try {
        const operatorId = req.user.id; // From the authenticated user

        // Ensure operatorId is correctly passed and used in query
        const buses = await Bus.find({ operatorId });

        if (!buses || buses.length === 0) {
            return res.status(404).json({ message: 'No buses found for this operator.' });
        }

        res.status(200).json(buses);
    } catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//Operators should be able to view the trips for their buses by bus number and date
const getBusTrips = async (req, res) => {
    try {
        const { busNumber, date } = req.query;
        const operatorId = req.user.id;

        // Check if bus number belongs to the operator
        const bus = await Bus.findOne({ busNumber, operatorId });
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found or not owned by this operator.' });
        }

        // Get trips for this bus on the specified date
        const trips = await Trip.find({ busNumber, date: { $gte: new Date(date), $lt: new Date(date).setDate(new Date(date).getDate() + 1) } });

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'No trips found for this bus on the given date.' });
        }

        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Operators should be able to view all trips of the buses they own
const getAllTrips = async (req, res) => {
    try {
        const operatorId = req.user.id;

        const buses = await Bus.find({ operatorId });
        const busNumbers = buses.map(bus => bus.busNumber);

        const trips = await Trip.find({ busNumber: { $in: busNumbers } });

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'No trips found for this operator.' });
        }

        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Operators should be able to view all bookings of their owned buses
const getAllBookings = async (req, res) => {
    try {
        const operatorId = req.user.id;

        const buses = await Bus.find({ operatorId });
        const busNumbers = buses.map(bus => bus.busNumber);

        const bookings = await Booking.find({ busNumber: { $in: busNumbers } });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this operator.' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Operators should be able to view bookings of their buses using the bus number and date
const getBookingsForBus = async (req, res) => {
    try {
        const { busNumber, date } = req.query;
        const operatorId = req.user.id;

        // Check if bus number belongs to the operator
        const bus = await Bus.findOne({ busNumber, operatorId });
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found or not owned by this operator.' });
        }

        const bookings = await Booking.find({ busNumber, date: { $gte: new Date(date), $lt: new Date(date).setDate(new Date(date).getDate() + 1) } });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this bus on the given date.' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//When an operator replaces a bus for a scheduled trip, all the commuters who booked tickets for that trip should be notified via email
const replaceBusInTrip = async (req, res) => {
    try {
        const { tripId, newBusNumber } = req.body;
        const operatorId = req.user.id;

        // Find the trip and check if the operator owns the bus
        const trip = await Trip.findById(tripId);
        if (!trip || trip.operatorId.toString() !== operatorId) {
            return res.status(404).json({ message: 'Trip not found or operator does not own this trip.' });
        }

        const newBus = await Bus.findOne({ busNumber: newBusNumber, operatorId });
        if (!newBus) {
            return res.status(404).json({ message: 'New bus not found or not owned by this operator.' });
        }

        // Replace the bus
        trip.busNumber = newBusNumber;
        await trip.save();

        // Notify commuters (send emails)
        const bookings = await Booking.find({ tripId });
        bookings.forEach(booking => {
            const emailContent = `
                Your bus has been replaced by ${newBusNumber}. 
                New details:
                Bus Number: ${newBusNumber}
                Seat Number: ${booking.seatNumber}
                Boarding Place: ${booking.boardingPlace}
                Destination Place: ${booking.destinationPlace}
            `;
            sendEmailToCommuter(booking.email, 'Bus Replacement Notification', emailContent);
        });

        res.status(200).json({ message: 'Bus replaced and commuters notified.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//When an operator cancels a bus trip, all the commuters who booked tickets for that trip should be notified via email with a refund notification.
const cancelBusTrip = async (req, res) => {
    try {
        const { tripId } = req.body;
        const operatorId = req.user.id;

        // Find the trip and check if the operator owns the bus
        const trip = await Trip.findById(tripId);
        if (!trip || trip.operatorId.toString() !== operatorId) {
            return res.status(404).json({ message: 'Trip not found or operator does not own this trip.' });
        }

        // Cancel the trip
        trip.status = 'Cancelled';
        await trip.save();

        // Notify commuters (send emails)
        const bookings = await Booking.find({ tripId });
        bookings.forEach(booking => {
            const emailContent = `
                Your trip on bus ${trip.busNumber} has been cancelled.
                Booking Refund Details:
                Seat Number: ${booking.seatNumber}
                Boarding Place: ${booking.boardingPlace}
                Destination Place: ${booking.destinationPlace}
                Total Price: ${booking.totalPrice} (Refund will be processed)
            `;
            sendEmailToCommuter(booking.email, 'Bus Cancellation Notification', emailContent);
        });

        res.status(200).json({ message: 'Trip cancelled and commuters notified.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Export the function
module.exports = {
    registerOperator,
    getAllOperators,
    getOperatorById,
    deleteOperatorById,
    getPendingOperators, 
    manageOperatorStatus, 
    getOwnedBuses,
    getBusTrips,
    getAllTrips,
    getAllBookings,
    getBookingsForBus,
    replaceBusInTrip,
    cancelBusTrip
};
