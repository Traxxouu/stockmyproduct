// routes/categoryRoutes.js
// Endpoints des catégories — protégés par JWT, certains réservés admin/manager

const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// GET /api/categories → tout le monde connecté peut voir les catégories
router.get('/', protect, getCategories);

// POST /api/categories → seulement admin et manager
router.post('/', protect, authorize('admin', 'manager'), createCategory);

// PUT /api/categories/:id → seulement admin et manager
router.put('/:id', protect, authorize('admin', 'manager'), updateCategory);

// DELETE /api/categories/:id → seulement admin
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;