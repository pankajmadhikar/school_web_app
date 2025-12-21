import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, deliveryType, pickupTime, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item',
      });
    }

    // Validate stock availability and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or inactive`,
        });
      }

      const stock = product.getStock(item.size, item.color || 'Default');

      if (stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} - Size: ${item.size}, Color: ${item.color}. Available: ${stock}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        size: item.size,
        color: item.color || 'Default',
        quantity: item.quantity,
        image: product.images[0] || '',
      });

      subtotal += product.price * item.quantity;
    }

    // Calculate shipping charges (you can customize this logic)
    const shippingCharges = subtotal > 2999 ? 0 : 99;
    const total = subtotal + shippingCharges;

    // Create order
    const order = await Order.create({
      orderNumber: Order.generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      deliveryType,
      pickupTime: deliveryType === 'store-pickup' ? pickupTime : null,
      subtotal,
      shippingCharges,
      total,
      notes: notes || '',
    });

    // Reduce stock for each item
    for (const item of items) {
      const product = await Product.findById(item.product);
      await product.reduceStock(item.size, item.color || 'Default', item.quantity);
    }

    const createdOrder = await Order.findById(order._id).populate(
      'items.product',
      'name sku images'
    );

    res.status(201).json({
      success: true,
      data: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by order number
// @route   GET /api/orders/:orderNumber
// @access  Public
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.product', 'name sku images')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50, startDate, endDate } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate('items.product', 'name sku images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
export const updateOrder = async (req, res, next) => {
  try {
    const { status, paymentStatus, notes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name sku images')
      .populate('user', 'name email');

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics (admin)
// @route   GET /api/admin/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: revenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

