// routes/stockRoutes.js
// Endpoints du stock — réservés aux admin et manager

const express = require('express');
const router = express.Router();
const { addStock, removeStock, getStockHistory } = require('../controllers/stockController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// POST /api/stock/add → entrée de stock
router.post('/add', protect, authorize('admin', 'manager'), addStock);

// POST /api/stock/remove → sortie de stock
router.post('/remove', protect, authorize('admin', 'manager'), removeStock);

// GET /api/stock/history → historique des mouvements
router.get('/history', protect, getStockHistory);

module.exports = router;