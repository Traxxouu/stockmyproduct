const { sendError } = require('../utils/response');

// role : admin, manager, user
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, 'Accès refusé');
    }
    next();
  };
};

module.exports = { authorize };