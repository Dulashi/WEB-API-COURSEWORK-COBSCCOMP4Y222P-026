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

// Export the function
module.exports = {
    registerOperator,
    getAllOperators,
    getPendingOperators, // Ensure this is also exported if you're using it
    manageOperatorStatus // Same for other functions
};
