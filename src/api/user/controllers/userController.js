const { User } = require('../models/user'); // Your User model
const bcrypt = require('bcryptjs');

const userController = {
  async getProfile(req, res) {
    try {
      // req.user should be set by auth middleware
      const userId = req.user.userId;
      
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] } // Don't return password
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user profile',
        error: error.message
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { name, email, currentPassword, newPassword } = req.body;

      // Find user
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Email already in use by another account'
          });
        }
      }

      // If changing password, verify current password
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Current password is required to set new password'
          });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }

        // Hash new password
        const saltRounds = 10;
        req.body.password = await bcrypt.hash(newPassword, saltRounds);
      } else {
        // Don't update password if not provided
        delete req.body.password;
      }

      // Remove currentPassword and newPassword from update data
      delete req.body.currentPassword;
      delete req.body.newPassword;

      // Update user
      await user.update(req.body);

      // Get updated user (without password)
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating user profile',
        error: error.message
      });
    }
  },

  async getAllUsers(req, res) {
    try {
      // Optional: Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin rights required.'
        });
      }

      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        count: users.length,
        data: { users }
      });

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: error.message
      });
    }
  },

  async getUserById(req, res) {
    try {
      const userId = req.params.id;

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: error.message
      });
    }
  }
};

module.exports = userController;