// models/StockMovement.js
// Représente un mouvement de stock (entrée ou sortie)
// Chaque modification de quantité crée un enregistrement ici → historique complet

const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // référence au model Product
    required: [true, 'Le produit est obligatoire']
  },
  type: {
    type: String,
    enum: ['entry', 'exit'], // entry = entrée de stock, exit = sortie
    required: [true, 'Le type de mouvement est obligatoire']
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est obligatoire'],
    min: [1, 'La quantité doit être au moins 1']
  },
  reason: {
    type: String,
    trim: true // ex: "livraison fournisseur", "vente client"
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // qui a effectué le mouvement
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('StockMovement', stockMovementSchema);