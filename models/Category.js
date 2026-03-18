// models/Category.js
// Représente une catégorie de produits (ex: Électronique, Alimentaire...)

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est obligatoire'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);