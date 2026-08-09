const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Runs after express-validator chain definitions; collects errors into one 400 response.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path,
      message: e.msg
    }));
    return next(new AppError('Validation failed', 400, details));
  }
  next();
};

module.exports = validate;
