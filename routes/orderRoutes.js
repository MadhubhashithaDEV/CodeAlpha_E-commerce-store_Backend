const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
