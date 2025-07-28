//Logic for KYA, application submission, and status tracking
const Application = require('../models/application.model');
const Business = require('../models/business.model');

// Get KYA (Know Your Approvals) results based on business profile
exports.getKYAResults = async (req, res) => {
  try {
    const { industryType, scale, businessActivity, location } = req.body;
    
    // Hardcoded list of required approvals based on business profile
    let requiredApprovals = [];
    
    // Check industry type
    if (industryType === 'Food & Beverage') {
      requiredApprovals.push({
        approvalName: 'FSSAI License',
        department: 'Food Safety and Standards Authority of India',
        description: 'Mandatory for all food businesses to ensure food safety standards',
        priority: 'High',
        estimatedTime: '30-45 days',
        applicationFee: '₹2,000 - ₹5,000'
      });
    }
    
    // Check for retail businesses
    if (industryType === 'Retail' || businessActivity?.includes('retail')) {
      requiredApprovals.push({
        approvalName: 'Shops and Establishment License',
        department: 'Labour Department',
        description: 'Required for all shops and commercial establishments',
        priority: 'High',
        estimatedTime: '15-30 days',
        applicationFee: '₹1,000 - ₹3,000'
      });
    }
    
    // GST Registration is required for most businesses
    if (scale !== 'Micro' || (scale === 'Micro' && businessActivity?.includes('interstate'))) {
      requiredApprovals.push({
        approvalName: 'GST Registration',
        department: 'Goods and Services Tax Department',
        description: 'Required for businesses with turnover above ₹20 lakhs (₹10 lakhs for special category states)',
        priority: 'High',
        estimatedTime: '3-7 days',
        applicationFee: 'Free'
      });
    }
    
    // MSME Registration
    if (['Micro', 'Small', 'Medium', 'Startup'].includes(scale)) {
      requiredApprovals.push({
        approvalName: 'MSME Registration (Udyam)',
        department: 'Ministry of Micro, Small and Medium Enterprises',
        description: 'Beneficial for MSMEs to avail government benefits and schemes',
        priority: 'Medium',
        estimatedTime: '1-2 days',
        applicationFee: 'Free'
      });
    }
    
    // Trade License
    requiredApprovals.push({
      approvalName: 'Trade License',
      department: 'Municipal Corporation of Delhi',
      description: 'Required for all businesses operating within Delhi',
      priority: 'High',
      estimatedTime: '15-30 days',
      applicationFee: '₹500 - ₹5,000 (based on business type and area)'
    });
    
    res.status(200).json({
      message: 'KYA results generated successfully',
      requiredApprovals
    });
  } catch (error) {
    console.error('KYA results error:', error);
    res.status(500).json({ message: 'Server error while generating KYA results' });
  }
};

// Create a new application (draft)
exports.createApplication = async (req, res) => {
  try {
    const { businessId, approvalName, department, applicationType, applicationData } = req.body;

    // Verify business belongs to user
    const business = await Business.findOne({ _id: businessId, user: req.userId });
    if (!business) {
      return res.status(404).json({ message: 'Business not found or not authorized' });
    }

    // Create new application
    const application = new Application({
      user: req.userId,
      business: businessId,
      approvalName,
      department,
      applicationType,
      applicationData: applicationData || {},
      status: 'DRAFT',
      statusHistory: [{
        status: 'DRAFT',
        comment: 'Application created',
        updatedBy: req.userId
      }]
    });

    await application.save();

    res.status(201).json({
      message: 'Application created successfully',
      application
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error while creating application' });
  }
};

// Get all applications for current user
exports.getMyApplications = async (req, res) => {
  try {
    const { status, type, businessId, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = { user: req.userId };
    if (status) filter.status = status;
    if (type) filter.applicationType = type;
    if (businessId) filter.business = businessId;

    // Count total documents matching the filter
    const total = await Application.countDocuments(filter);
    
    // Find applications with pagination
    const applications = await Application.find(filter)
      .populate('business', 'businessName')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('business');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error while fetching application' });
  }
};

// Update application (draft)
exports.updateApplication = async (req, res) => {
  try {
    const { applicationData, documents } = req.body;

    // Find application
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only allow updates if application is in DRAFT or ADDITIONAL_INFO_REQUIRED status
    if (application.status !== 'DRAFT' && application.status !== 'ADDITIONAL_INFO_REQUIRED') {
      return res.status(400).json({ 
        message: 'Cannot update application in its current status' 
      });
    }

    // Update application data
    if (applicationData) {
      application.applicationData = {
        ...application.applicationData,
        ...applicationData
      };
    }

    // Add new documents if provided
    if (documents && Array.isArray(documents)) {
      application.documents = [...application.documents, ...documents];
    }

    await application.save();

    res.status(200).json({
      message: 'Application updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error while updating application' });
  }
};

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    // Find application
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only allow submission if application is in DRAFT or ADDITIONAL_INFO_REQUIRED status
    if (application.status !== 'DRAFT' && application.status !== 'ADDITIONAL_INFO_REQUIRED') {
      return res.status(400).json({ 
        message: 'Cannot submit application in its current status' 
      });
    }

    // Update status
    application.status = 'SUBMITTED';
    application.submittedAt = new Date();
    application.updatedAt = new Date();
    
    // Add status history entry
    application.statusHistory.push({
      status: 'SUBMITTED',
      comment: 'Application submitted for review',
      updatedBy: req.userId,
      timestamp: new Date()
    });

    await application.save();

    res.status(200).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Server error while submitting application' });
  }
};

// Delete application (only if in DRAFT status)
exports.deleteApplication = async (req, res) => {
  try {
    // Find application
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId,
      status: 'DRAFT' // Only allow deletion of draft applications
    });

    if (!application) {
      return res.status(404).json({ 
        message: 'Application not found or cannot be deleted in its current status' 
      });
    }

    await Application.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error while deleting application' });
  }
};

// Track application by tracking ID (public route)
exports.trackApplication = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const application = await Application.findOne({ trackingId })
      .select('applicationType status submittedAt updatedAt approvalDate rejectionDate trackingId')
      .populate('business', 'businessName');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Track application error:', error);
    res.status(500).json({ message: 'Server error while tracking application' });
  }
};