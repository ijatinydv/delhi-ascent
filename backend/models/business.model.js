// Mongoose schema for Business Profiles
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Address schema for structured address data
const addressSchema = new Schema({
  street: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  }
});

// Business schema
const businessSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  industryType: {
    type: String,
    trim: true
  },
  scale: {
    type: String,
    enum: ['MSME', 'Small', 'Medium', 'Large', 'Startup'],
    default: 'MSME'
  },
  address: addressSchema,
  profileData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster queries
businessSchema.index({ user: 1 });
businessSchema.index({ businessName: 'text' });

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;