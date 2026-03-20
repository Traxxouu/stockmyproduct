// models/User.js
// Représente un utilisateur de l'application
// Rôles possibles : admin (tout), manager (stock+produits), user (lecture seule)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  }
}, { timestamps: true });

// Avant chaque sauvegarde, on hash le mot de passe s'il a changé
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode pour vérifier si un mot de passe correspond au hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);