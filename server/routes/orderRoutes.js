import express from 'express';
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);
router.get('/:orderNumber', getOrder);

// Admin routes
router.get('/admin/all', protect, getOrders);
router.put('/admin/:id', protect, updateOrder);
router.get('/admin/stats', protect, getOrderStats);

export default router;

