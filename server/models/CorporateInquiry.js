import mongoose from 'mongoose';

const corporateInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    requirement: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'converted', 'closed'],
      default: 'new',
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
corporateInquirySchema.index({ status: 1 });
corporateInquirySchema.index({ createdAt: -1 });

const CorporateInquiry = mongoose.model('CorporateInquiry', corporateInquirySchema);

export default CorporateInquiry;

