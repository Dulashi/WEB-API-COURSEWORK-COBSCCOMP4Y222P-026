const authorizeRoles = (roles) => {
    return (req, res, next) => {
      // Check if req.user is defined and if req.user.roles is an array
      if (!req.user || !Array.isArray(req.user.roles)) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
  
      // Check if any of the roles in req.user.roles match the required roles
      if (!roles.some(role => req.user.roles.includes(role))) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
  
      // Proceed to the next middleware
      next();
    };
};

module.exports = authorizeRoles;
