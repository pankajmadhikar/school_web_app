import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  color: {
    type: String,
    default: 'Default',
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['uniforms', 'sportswear', 'footwear', 'accessories', 'outerwear'],
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
    },
    institution: {
      type: String,
      default: null, // For non-school products (e.g., mens-wear, corporate)
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    stock: [stockSchema], // Array of stock per size and color
    sizes: [
      {
        type: String,
        required: true,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    lowStockAlert: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
// Note: sku already has unique: true which creates an index automatically
productSchema.index({ school: 1, category: 1 });
productSchema.index({ isActive: 1 });

// Virtual to check if product is out of stock
productSchema.virtual('isOutOfStock').get(function () {
  if (!this.stock || this.stock.length === 0) return true;
  return this.stock.every((item) => item.quantity === 0);
});

// Method to check stock for specific size and color
productSchema.methods.getStock = function (size, color = 'Default') {
  const stockItem = this.stock.find(
    (item) => item.size === size && item.color === color
  );
  return stockItem ? stockItem.quantity : 0;
};

// Method to update stock
productSchema.methods.updateStock = function (size, color, quantity) {
  const stockIndex = this.stock.findIndex(
    (item) => item.size === size && item.color === color
  );

  if (stockIndex !== -1) {
    this.stock[stockIndex].quantity = Math.max(0, quantity);
  } else {
    this.stock.push({ size, color, quantity: Math.max(0, quantity) });
  }

  // Update low stock alert
  this.updateLowStockAlert();
  return this.save();
};

// Method to reduce stock
productSchema.methods.reduceStock = function (size, color, quantity) {
  const stockIndex = this.stock.findIndex(
    (item) => item.size === size && item.color === color
  );

  if (stockIndex !== -1) {
    this.stock[stockIndex].quantity = Math.max(
      0,
      this.stock[stockIndex].quantity - quantity
    );
    this.updateLowStockAlert();
    return this.save();
  }

  throw new Error('Stock item not found');
};

// Method to update low stock alert
productSchema.methods.updateLowStockAlert = function () {
  const threshold = process.env.LOW_STOCK_THRESHOLD || 5;
  this.lowStockAlert = this.stock.some((item) => item.quantity > 0 && item.quantity <= threshold);
};

// Pre-save hook to update low stock alert
productSchema.pre('save', function () {
  if (this.isModified('stock')) {
    this.updateLowStockAlert();
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;

