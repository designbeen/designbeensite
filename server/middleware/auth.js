const jwt = require('jsonwebtoken');
const HttpError = require('../utils/httpError');

function requireAuth(req, res, next) {
  const token = req.cookies?.auth_token;
  if (!token) {
    return next(new HttpError(401, 'Authentication required'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    if (!(error instanceof jwt.TokenExpiredError) && !(error instanceof jwt.JsonWebTokenError)) {
      return next(error);
    }
    return next(new HttpError(401, 'Invalid or expired session'));
  }
}

module.exports = {
  requireAuth,
};
