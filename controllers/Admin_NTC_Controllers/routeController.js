const Route = require('../../models/Route');

// Get all routes
exports.searchRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes', error: error.message });
  }
};

// Get a route by its route number
exports.getRouteByNumber = async (req, res) => {
  const { routeNumber } = req.params;
  try {
    const route = await Route.findOne({ routeNumber });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching route', error: error.message });
  }
};

// Create a new route
exports.createRoute = async (req, res) => {
  const { routeNumber, startPoint, endPoint, stops, distance } = req.body;
  try {
    const newRoute = new Route({ routeNumber, startPoint, endPoint, stops, distance });
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    res.status(500).json({ message: 'Error creating route', error: error.message });
  }
};

// Update an existing route
exports.updateRoute = async (req, res) => {
  const { routeNumber } = req.params;
  const updateData = req.body;
  try {
    const updatedRoute = await Route.findOneAndUpdate({ routeNumber }, updateData, { new: true });
    if (!updatedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json(updatedRoute);
  } catch (error) {
    res.status(500).json({ message: 'Error updating route', error: error.message });
  }
};

// Delete a route
exports.deleteRoute = async (req, res) => {
  const { routeNumber } = req.params;
  try {
    const deletedRoute = await Route.findOneAndDelete({ routeNumber });
    if (!deletedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting route', error: error.message });
  }
};
