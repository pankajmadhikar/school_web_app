import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    logo: {
      type: String, // URL or file path
      default: null,
    },
    image: {
      type: String, // Additional image
      default: null,
    },
    color: {
      type: String,
      default: '#0ea5e9',
    },
    category: {
      type: String,
      enum: ['primary', 'pre-primary', 'secondary', 'institution'],
      default: 'primary',
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
// Note: name and slug already have unique: true which creates indexes automatically
schoolSchema.index({ isActive: 1 });

const School = mongoose.model('School', schoolSchema);

export default School;

