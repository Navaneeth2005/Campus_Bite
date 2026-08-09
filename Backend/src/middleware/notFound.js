// Fallback for any route not registered above.
// eslint-disable-next-line no-unused-vars
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

module.exports = notFound;
