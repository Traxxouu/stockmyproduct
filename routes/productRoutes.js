// routes/productRoutes.js
// Endpoints des produits

const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// GET /api/products → tout le monde connecté
router.get('/', protect, getProducts);

// GET /api/products/:id → tout le monde connecté
router.get('/:id', protect, getProductById);

// POST /api/products → admin et manager seulement
router.post('/', protect, authorize('admin', 'manager'), createProduct);

// PUT /api/products/:id → admin et manager seulement
router.put('/:id', protect, authorize('admin', 'manager'), updateProduct);

// DELETE /api/products/:id → admin seulement
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;