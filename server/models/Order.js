import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'Default',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    default: '',
  },
});

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    default: '',
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Optional user
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    deliveryType: {
      type: String,
      enum: ['delivery', 'store-pickup'],
      required: true,
    },
    pickupTime: {
      type: Date,
      default: null, // For store pickup
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'cash-on-delivery',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
// Note: orderNumber already has unique: true which creates an index automatically
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number
orderSchema.statics.generateOrderNumber = function () {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;

