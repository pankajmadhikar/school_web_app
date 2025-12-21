import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  updateProductStock,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);

// Admin specific routes (must be before /:id route)
router.get('/admin/all', protect, getAdminProducts);
router.put('/admin/:id/stock', protect, updateProductStock);

// Public routes (continue)
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;

