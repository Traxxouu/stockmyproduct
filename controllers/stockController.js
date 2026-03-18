// controllers/stockController.js
// Gère les entrées et sorties de stock
// Règle critique : le stock ne peut JAMAIS passer en négatif

const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { sendSuccess, sendError } = require('../utils/response');

// ── Entrée de stock ──────────────────────────────────────────────
const addStock = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    if (!productId || !quantity) {
      return sendError(res, 400, 'Produit et quantité sont obligatoires.');
    }

    // On cherche le produit (non supprimé)
    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) return sendError(res, 404, 'Produit introuvable.');

    // On augmente la quantité en stock
    product.quantity += quantity;
    await product.save();

    // On enregistre le mouvement dans l'historique
    const movement = await StockMovement.create({
      product: productId,
      type: 'entry',
      quantity,
      reason,
      performedBy: req.user.id // l'utilisateur connecté (vient du token JWT)
    });

    return sendSuccess(res, 200, { product, movement });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ── Sortie de stock ──────────────────────────────────────────────
const removeStock = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    if (!productId || !quantity) {
      return sendError(res, 400, 'Produit et quantité sont obligatoires.');
    }

    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) return sendError(res, 404, 'Produit introuvable.');

    // Règle métier : on vérifie que le stock ne passe pas en négatif
    if (product.quantity < quantity) {
      return sendError(res, 400, `Stock insuffisant. Stock actuel : ${product.quantity}`);
    }

    // On diminue la quantité
    product.quantity -= quantity;
    await product.save();

    // On enregistre le mouvement
    const movement = await StockMovement.create({
      product: productId,
      type: 'exit',
      quantity,
      reason,
      performedBy: req.user.id
    });

    return sendSuccess(res, 200, { product, movement });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ── Historique des mouvements ────────────────────────────────────
const getStockHistory = async (req, res) => {
  try {
    // .populate() remplace les IDs par les vraies données
    const movements = await StockMovement.find()
      .populate('product', 'name quantity')    // on récupère nom et quantité du produit
      .populate('performedBy', 'name email')   // on récupère nom et email de l'utilisateur
      .sort({ createdAt: -1 });                // du plus récent au plus ancien

    return sendSuccess(res, 200, movements);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { addStock, removeStock, getStockHistory };