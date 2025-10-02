const jwt = require('jsonwebtoken');

const jwtUtils = {
  /**
   * Generate JWT token
   * @param {Object} payload - Data to encode in token
   * @param {String} expiresIn - Token expiration (default: 24h)
   * @returns {String} JWT token
   */
  generateToken(payload, expiresIn = '24h') {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }

      if (!payload || typeof payload !== 'object') {
        throw new Error('Payload must be a non-empty object');
      }

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn }
      );

      console.log('✅ Token generated for user:', payload.email || payload.userId);
      return token;
    } catch (error) {
      console.error('❌ Token generation failed:', error.message);
      throw new Error(`Token generation failed: ${error.message}`);
    }
  },

  /**
   * Verify JWT token
   * @param {String} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      if (!token) {
        throw new Error('No token provided');
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }

      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace('Bearer ', '');

      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
      
      console.log('✅ Token verified for user:', decoded.email || decoded.userId);
      return decoded;
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      
      // Specific error handling
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      
      throw new Error(`Token verification failed: ${error.message}`);
    }
  },

  /**
   * Decode JWT token without verification
   * @param {String} token - JWT token to decode
   * @returns {Object|null} Decoded token payload or null
   */
  decodeToken(token) {
    try {
      if (!token) {
        console.warn('⚠️ No token provided for decoding');
        return null;
      }

      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace('Bearer ', '');

      const decoded = jwt.decode(cleanToken);
      
      if (!decoded) {
        console.warn('⚠️ Token decoding returned null');
        return null;
      }

      console.log('🔓 Token decoded (not verified) for user:', decoded.email || decoded.userId);
      return decoded;
    } catch (error) {
      console.error('❌ Token decoding failed:', error.message);
      return null;
    }
  },

  /**
   * Extract token from request headers
   * @param {Object} req - Express request object
   * @returns {String|null} Token or null
   */
  extractTokenFromHeader(req) {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
      }

      return authHeader.replace('Bearer ', '');
    } catch (error) {
      console.error('❌ Token extraction failed:', error.message);
      return null;
    }
  },

  /**
   * Check if token is expired (without verification)
   * @param {String} token - JWT token to check
   * @returns {Boolean} True if expired
   */
  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      
      if (!decoded || !decoded.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('❌ Token expiration check failed:', error.message);
      return true;
    }
  },

  /**
   * Get token expiration time
   * @param {String} token - JWT token
   * @returns {Date|null} Expiration date or null
   */
  getTokenExpiration(token) {
    try {
      const decoded = this.decodeToken(token);
      
      if (!decoded || !decoded.exp) {
        return null;
      }

      return new Date(decoded.exp * 1000);
    } catch (error) {
      console.error('❌ Getting token expiration failed:', error.message);
      return null;
    }
  }
};

module.exports = jwtUtils;