import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register admin
// @route   POST /api/admin/register
// @access  Private (Super Admin only)
export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin
// @route   GET /api/admin/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admins
// @route   GET /api/admin
// @access  Private (Super Admin only)
export const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

