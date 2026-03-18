// controllers/categoryController.js
// Gère le CRUD des catégories (Create, Read, Update, Delete)

const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/response');

// ── Créer une catégorie ──────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return sendError(res, 400, 'Le nom est obligatoire.');

    const category = await Category.create({ name, description });
    return sendSuccess(res, 201, category);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ── Récupérer toutes les catégories ─────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return sendSuccess(res, 200, categories);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ── Modifier une catégorie ───────────────────────────────────────
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: true retourne le document modifié
    );

    if (!category) return sendError(res, 404, 'Catégorie introuvable.');
    return sendSuccess(res, 200, category);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ── Supprimer une catégorie ──────────────────────────────────────
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) return sendError(res, 404, 'Catégorie introuvable.');
    return sendSuccess(res, 200, { message: 'Catégorie supprimée.' });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };