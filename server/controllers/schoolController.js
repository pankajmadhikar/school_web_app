import School from '../models/School.js';
import Product from '../models/Product.js';

// @desc    Get all schools (public)
// @route   GET /api/schools
// @access  Public
export const getSchools = async (req, res, next) => {
  try {
    const schools = await School.find({ isActive: true }).sort({ name: 1 });

    res.json({
      success: true,
      count: schools.length,
      data: schools,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single school (public)
// @route   GET /api/schools/:id
// @access  Public
export const getSchool = async (req, res, next) => {
  try {
    const school = await School.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isActive: true,
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found',
      });
    }

    res.json({
      success: true,
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create school (admin)
// @route   POST /api/schools
// @access  Private/Admin
export const createSchool = async (req, res, next) => {
  try {
    const { name, ...rest } = req.body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const school = await School.create({
      name,
      slug,
      ...rest,
    });

    res.status(201).json({
      success: true,
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update school (admin)
// @route   PUT /api/schools/:id
// @access  Private/Admin
export const updateSchool = async (req, res, next) => {
  try {
    let school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found',
      });
    }

    // Update slug if name changed
    if (req.body.name && req.body.name !== school.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    school = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete school (admin)
// @route   DELETE /api/schools/:id
// @access  Private/Admin
export const deleteSchool = async (req, res, next) => {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found',
      });
    }

    // Check if school has products
    const productCount = await Product.countDocuments({ school: school._id });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete school. It has ${productCount} associated products. Please remove or reassign products first.`,
      });
    }

    // Soft delete
    school.isActive = false;
    await school.save();

    res.json({
      success: true,
      message: 'School deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all schools with stats (admin)
// @route   GET /api/admin/schools
// @access  Private/Admin
export const getAdminSchools = async (req, res, next) => {
  try {
    const schools = await School.find().sort({ name: 1 });

    // Get product counts for each school
    const schoolsWithStats = await Promise.all(
      schools.map(async (school) => {
        const productCount = await Product.countDocuments({
          school: school._id,
          isActive: true,
        });

        return {
          ...school.toObject(),
          productCount,
        };
      })
    );

    res.json({
      success: true,
      count: schoolsWithStats.length,
      data: schoolsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

