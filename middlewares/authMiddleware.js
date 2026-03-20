const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const protect = (req, res, next) => {
  // format token : Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Accès refusé. Token manquant.');
  }

  // extract + on enleve le Bearer
  const token = authHeader.split(' ')[1];

  try {
    // verif token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 401, 'Token invalide ou expiré.');
  }
};

module.exports = { protect };