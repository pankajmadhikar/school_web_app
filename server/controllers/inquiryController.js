import CorporateInquiry from '../models/CorporateInquiry.js';

// @desc    Create corporate inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res, next) => {
  try {
    const { name, companyName, email, phone, requirement } = req.body;

    if (!name || !companyName || !email || !phone || !requirement) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const inquiry = await CorporateInquiry.create({
      name,
      companyName,
      email,
      phone,
      requirement,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (admin)
// @route   GET /api/admin/inquiries
// @access  Private/Admin
export const getInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const inquiries = await CorporateInquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CorporateInquiry.countDocuments(query);

    res.json({
      success: true,
      count: inquiries.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inquiry (admin)
// @route   GET /api/admin/inquiries/:id
// @access  Private/Admin
export const getInquiry = async (req, res, next) => {
  try {
    const inquiry = await CorporateInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status (admin)
// @route   PUT /api/admin/inquiries/:id
// @access  Private/Admin
export const updateInquiry = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const inquiry = await CorporateInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    if (status) inquiry.status = status;
    if (notes !== undefined) inquiry.notes = notes;

    await inquiry.save();

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inquiry statistics (admin)
// @route   GET /api/admin/inquiries/stats
// @access  Private/Admin
export const getInquiryStats = async (req, res, next) => {
  try {
    const total = await CorporateInquiry.countDocuments();
    const newInquiries = await CorporateInquiry.countDocuments({ status: 'new' });
    const contacted = await CorporateInquiry.countDocuments({ status: 'contacted' });
    const converted = await CorporateInquiry.countDocuments({ status: 'converted' });

    res.json({
      success: true,
      data: {
        total,
        newInquiries,
        contacted,
        converted,
      },
    });
  } catch (error) {
    next(error);
  }
};

