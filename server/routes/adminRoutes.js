import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getMe,
  getAdmins,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', protect, authorize('super-admin'), registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.get('/', protect, authorize('super-admin'), getAdmins);

export default router;

