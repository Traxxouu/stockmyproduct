// models/Product.js
// Représente un produit en stock
// isDeleted permet le soft delete : on ne supprime jamais vraiment en base

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est obligatoire'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'La quantité ne peut pas être négative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // référence au model Category
    required: [true, 'La catégorie est obligatoire']
  },
  isDeleted: {
    type: Boolean,
    default: false // false = produit actif, true = supprimé logiquement
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);