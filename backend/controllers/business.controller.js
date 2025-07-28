//Logic for creating/updating business profiles
const Business = require('../models/business.model');

// Create a new business profile
exports.createBusiness = async (req, res) => {
  try {
    // Check if user already has a business profile
    const existingBusiness = await Business.findOne({ user: req.userId });
    if (existingBusiness) {
      return res.status(400).json({ message: 'You already have a business profile' });
    }

    // Create new business profile
    const business = new Business({
      ...req.body,
      user: req.userId
    });

    await business.save();

    res.status(201).json({
      message: 'Business profile created successfully',
      business
    });
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({ message: 'Server error while creating business profile' });
  }
};

// Get current user's business profile
exports.getMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ user: req.userId });
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    res.status(200).json(business);
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ message: 'Server error while fetching business profile' });
  }
};

// Update business profile
exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ user: req.userId });
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    // Fields that shouldn't be updated directly
    const restrictedFields = ['user', 'isVerified', 'registrationDate'];
    
    // Remove restricted fields from the update
    const updateData = Object.keys(req.body).reduce((obj, key) => {
      if (!restrictedFields.includes(key)) {
        obj[key] = req.body[key];
      }
      return obj;
    }, {});

    // Update the business profile
    const updatedBusiness = await Business.findOneAndUpdate(
      { user: req.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Business profile updated successfully',
      business: updatedBusiness
    });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({ message: 'Server error while updating business profile' });
  }
};

// Delete business profile
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findOneAndDelete({ user: req.userId });
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    res.status(200).json({ message: 'Business profile deleted successfully' });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({ message: 'Server error while deleting business profile' });
  }
};

// Get business profile by ID (for admin or public view)
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    res.status(200).json(business);
  } catch (error) {
    console.error('Get business by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching business profile' });
  }
};

// Get all businesses (with pagination and filters)
exports.getAllBusinesses = async (req, res) => {
  try {
    const { page = 1, limit = 10, industryType, scale, verified } = req.query;
    
    // Build filter object
    const filter = {};
    if (industryType) filter.industryType = industryType;
    if (scale) filter.scale = scale;
    if (verified !== undefined) filter.isVerified = verified === 'true';

    // Count total documents matching the filter
    const total = await Business.countDocuments(filter);
    
    // Find businesses with pagination
    const businesses = await Business.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      businesses,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get all businesses error:', error);
    res.status(500).json({ message: 'Server error while fetching businesses' });
  }
};