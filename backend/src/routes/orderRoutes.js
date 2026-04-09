const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, updateOrderStatus, getMyOrders, getOrders } = require('../controllers/orderController');
const { protect, admin, driver } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, driver, updateOrderStatus);

module.exports = router;
