import Product from '../models/Product.js';

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      school,
      category,
      institution,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isActive: true };

    if (school) {
      query.school = school;
    }

    if (category) {
      query.category = category;
    }

    if (institution) {
      query.institution = institution;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate('school', 'name slug logo color')
      .select('-lowStockAlert')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    // Transform products to include stock status (not quantity)
    const transformedProducts = products.map((product) => {
      const productObj = product.toObject();
      
      // Calculate stock status per size
      productObj.stockStatus = productObj.stock.map((stockItem) => ({
        size: stockItem.size,
        color: stockItem.color,
        inStock: stockItem.quantity > 0,
      }));

      // Remove stock quantity from response
      delete productObj.stock;

      // Add isOutOfStock flag
      productObj.isOutOfStock = product.stock.every(
        (item) => item.quantity === 0
      );

      return productObj;
    });

    res.json({
      success: true,
      count: transformedProducts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: transformedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product (public)
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('school', 'name slug logo color')
      .select('-lowStockAlert');

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const productObj = product.toObject();

    // Transform stock to show only availability, not quantity
    productObj.stockStatus = productObj.stock.map((stockItem) => ({
      size: stockItem.size,
      color: stockItem.color,
      inStock: stockItem.quantity > 0,
    }));

    delete productObj.stock;
    productObj.isOutOfStock = product.stock.every((item) => item.quantity === 0);

    res.json({
      success: true,
      data: productObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    await product.populate('school', 'name slug logo color');

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('school', 'name slug logo color');

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete - set isActive to false
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with stock (admin)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = async (req, res, next) => {
  try {
    const {
      school,
      category,
      lowStock,
      outOfStock,
      search,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    if (school) {
      query.school = school;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    let products = await Product.find(query)
      .populate('school', 'name slug logo color')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Filter by low stock
    if (lowStock === 'true') {
      products = products.filter((product) => product.lowStockAlert);
    }

    // Filter by out of stock
    if (outOfStock === 'true') {
      products = products.filter((product) =>
        product.stock.every((item) => item.quantity === 0)
      );
    }

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product stock (admin)
// @route   PUT /api/admin/products/:id/stock
// @access  Private/Admin
export const updateProductStock = async (req, res, next) => {
  try {
    const { size, color, quantity } = req.body;

    if (!size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide size and quantity',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.updateStock(size, color || 'Default', Number(quantity));

    const updatedProduct = await Product.findById(req.params.id)
      .populate('school', 'name slug logo color');

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Stock updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

