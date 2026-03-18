const { sendError } = require('../utils/response');

// On passe les rôles autorisés en paramètre, ex: authorize('admin', 'manager')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Accès refusé. Rôle requis : ${roles.join(' ou ')}`);
    }
    next();
  };
};

module.exports = { authorize };