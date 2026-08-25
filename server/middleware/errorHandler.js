function notFound(req, res, next) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (!res.headersSent) {
    res.status(statusCode).json({ success: false, message });
  } else {
    next(err);
  }
}

module.exports = {
  notFound,
  errorHandler,
};
