const authorizeRoles = (roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.some((role) => req.user.roles.includes(role))) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
      next();
    };
  };
  
  module.exports = authorizeRoles;
  