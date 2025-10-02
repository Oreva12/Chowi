const jwt = require('jsonwebtoken');
const { User } = require('../api/user/models/user'); // Your User model

const authMiddleware = {
  async verifyToken(req, res, next) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user still exists
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists.'
        });
      }

      // Add user to request object
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired.'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Token verification failed.'
      });
    }
  },

  async optionalAuth(req, res, next) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        // No token, continue without user
        return next();
      }

      // Verify token if provided
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user exists
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });
      
      if (user) {
        // Add user to request object if valid
        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        };
      }

      next();
    } catch (error) {
      // If token is invalid, just continue without user
      // Don't block the request for optional auth
      console.log('Optional auth - invalid token, continuing without user');
      next();
    }
  },

  // Optional: Admin-only middleware
  requireAdmin(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  },

  // Optional: Vendor or Admin middleware
  requireVendorOrAdmin(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!['vendor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Vendor or Admin privileges required.'
      });
    }

    next();
  }
};

module.exports = authMiddleware;