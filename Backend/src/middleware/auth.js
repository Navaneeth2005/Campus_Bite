const User = require('../models/User');
const { verifyToken } = require('../services/token.service');
const AppError = require('../utils/AppError');

// Reads "Authorization: Bearer <token>", verifies the JWT and loads the user.
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      throw new AppError('Invalid or expired token. Please log in again.', 401);
    }

    const user = await User.findById(payload.id).select('+password').lean();
    if (!user) {
      throw new AppError('The account associated with this token no longer exists.', 401);
    }

    req.user = user;
    req.userId = String(user._id);
    next();
  } catch (error) {
    next(error);
  }
};

// Requires req.user.role to be one of the allowed roles.
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
