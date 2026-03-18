const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const protect = (req, res, next) => {
  // On récupère le header Authorization (format : "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Accès refusé. Token manquant.');
  }

  // On extrait le token (on enlève "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify vérifie la signature ET la date d'expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // on attache les infos du user à la requête
    next(); // tout est OK, on passe à la suite
  } catch (error) {
    return sendError(res, 401, 'Token invalide ou expiré.');
  }
};

module.exports = { protect };