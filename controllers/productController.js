// controllers/productController.js
// Gère le CRUD des produits
// La suppression est un soft delete : on met isDeleted à true, on ne supprime pas en base

const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/response');

// ── Créer un produit ─────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    if (!name || !price || !category) {
      return sendError(res, 400, 'Nom, prix et catégorie sont obligatoires.');
    }

    const product = await Product.create({ name, description, price, quantity, category });
    return sendSuccess(res, 201, product);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ── Récupérer tous les produits (hors supprimés) ─────────────────
const getProducts = async (req, res) => {
  try {
    // On filtre les produits avec isDeleted: false
    // .populate('category') remplace l'ID par les données de la catégorie
    const products = await Product.find({ isDeleted: false }).populate('category');
    return sendSuccess(res, 200, products);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ── Récupérer un produit par son ID ─────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('category');

    if (!product) return sendError(res, 404, 'Produit introuvable.');
    return sendSuccess(res, 200, product);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ── Modifier un produit ──────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) return sendError(res, 404, 'Produit introuvable.');
    return sendSuccess(res, 200, product);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ── Supprimer un produit (soft delete) ──────────────────────────
const deleteProduct = async (req, res) => {
  try {
    // On ne supprime PAS en base, on met juste isDeleted à true
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!product) return sendError(res, 404, 'Produit introuvable.');
    return sendSuccess(res, 200, { message: 'Produit supprimé.' });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };