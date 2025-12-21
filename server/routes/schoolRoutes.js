import express from 'express';
import {
  getSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
  getAdminSchools,
} from '../controllers/schoolController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getSchools);
router.get('/:id', getSchool);

// Admin routes
router.post('/', protect, createSchool);
router.put('/:id', protect, updateSchool);
router.delete('/:id', protect, deleteSchool);

// Admin specific routes
router.get('/admin/all', protect, getAdminSchools);

export default router;

