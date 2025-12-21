import express from 'express';
import {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  getInquiryStats,
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createInquiry);

// Admin routes
router.get('/admin/all', protect, getInquiries);
router.get('/admin/:id', protect, getInquiry);
router.put('/admin/:id', protect, updateInquiry);
router.get('/admin/stats', protect, getInquiryStats);

export default router;

