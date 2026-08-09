const User = require('../models/User');
const { signToken } = require('../services/token.service');
const AppError = require('../utils/AppError');

const register = async (req, res, next) => {
  try {
    const { name, email, college, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError('An account with this email already exists', 409));
    }

    const user = await User.create({ name, email, college, password });

    const token = signToken({ id: user._id, role: user.role });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toSafeJSON()
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = signToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Current user (requires authenticate middleware)
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({ success: true, user: user.toSafeJSON() });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, college } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (college) updates.college = college.trim();
    if (Object.keys(updates).length === 0) {
      return next(new AppError('Nothing to update', 400));
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeJSON()
    });
  } catch (error) {
    next(error);
  }
};

// JWTs are stateless; logout is handled by the client deleting the token.
// This endpoint exists for a complete, honest API contract.
const logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = { register, login, me, updateProfile, logout };
