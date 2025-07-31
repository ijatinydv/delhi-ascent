// Mongoose schema for License/Approval Applications
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Document schema for application attachments
const documentSchema = new Schema({
  docName: {
    type: String,
    required: true
  },
  docUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Status history schema to track application progress
const statusHistorySchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'APPROVED', 'REJECTED']
  },
  comment: {
    type: String
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Application schema
const applicationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  approvalName: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  applicationType: {
    type: String,
    required: true,
    enum: ['FSSAI', 'SHOPS_ACT', 'GST', 'MSME', 'TRADE_LICENSE', 'OTHER']
  },
  applicationData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  documents: [documentSchema],
  status: {
    type: String,
    required: true,
    enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'APPROVED', 'REJECTED'],
    default: 'DRAFT'
  },
  statusHistory: [statusHistorySchema],
  submittedAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  approvalDate: {
    type: Date
  },
  rejectionDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  applicationFee: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  trackingId: {
    type: String,
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
applicationSchema.index({ user: 1 });
applicationSchema.index({ business: 1 });
applicationSchema.index({ applicationType: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ department: 1 });
applicationSchema.index({ trackingId: 1 }, { unique: true });
applicationSchema.index({ approvalName: 'text' });

// Generate tracking ID before saving
applicationSchema.pre('save', async function(next) {
  if (!this.trackingId) {
    // Generate a unique tracking ID: APP-<YEAR><MONTH><DAY>-<RANDOM 4 DIGITS>
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    
    this.trackingId = `APP-${year}${month}${day}-${random}`;
  }
  
  // Always update the updatedAt field
  this.updatedAt = new Date();
  
  // If status changes to SUBMITTED, set submittedAt date
  if (this.isModified('status') && this.status === 'SUBMITTED' && !this.submittedAt) {
    this.submittedAt = new Date();
  }
  
  // If status changes to APPROVED, set approval date
  if (this.isModified('status') && this.status === 'APPROVED' && !this.approvalDate) {
    this.approvalDate = new Date();
  }
  
  // If status changes to REJECTED, set rejection date
  if (this.isModified('status') && this.status === 'REJECTED' && !this.rejectionDate) {
    this.rejectionDate = new Date();
  }
  
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;