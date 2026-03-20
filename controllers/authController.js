const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');



const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // verif
    if (!name || !email || !password) {
      return sendError(res, 400, 'Nom, email et mot de passe sont obligatoires.');
    }

    // verif email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'Cet email est déjà utilisé.');
    }

    // créer user
    const user = await User.create({ name, email, password, role });

    // generer le token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return sendSuccess(res, 201, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    return sendError(res, 500, error.message);
  }
};




const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email et mot de passe sont obligatoires.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401, 'Email ou mot de passe incorrect.');
    }

    // 
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Email ou mot de passe incorrect.');
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return sendSuccess(res, 200, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { register, login };