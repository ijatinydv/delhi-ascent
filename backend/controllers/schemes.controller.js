// Controller for government schemes matching
const Business = require('../models/business.model');

// Hardcoded list of government schemes
const governmentSchemes = [
  {
    id: 1,
    title: 'PM SVANidhi - PM Street Vendor\'s AtmaNirbhar Nidhi',
    category: 'Financial Support',
    eligibility: 'Street vendors operating in urban areas',
    benefits: 'Collateral-free working capital loans of up to ₹10,000 with subsidized interest rates',
    deadline: 'Ongoing',
    industry: ['Retail', 'Food & Beverages'],
    scale: ['MSME', 'Small'],
    description: 'PM SVANidhi is a micro-credit facility that provides street vendors with affordable working capital loans to resume their businesses affected due to COVID-19 pandemic.',
    applicationUrl: 'https://pmsvanidhi.mohua.gov.in/',
    documents: ['Identity Proof', 'Address Proof', 'Vendor Certificate/ID Card']
  },
  {
    id: 2,
    title: 'CGSS - Credit Guarantee Scheme for Startups',
    category: 'Credit Guarantee',
    eligibility: 'DPIIT-recognized startups',
    benefits: 'Collateral-free loans up to ₹10 crore with credit guarantee coverage',
    deadline: 'Ongoing',
    industry: ['All'],
    scale: ['Startup'],
    description: 'The Credit Guarantee Scheme for Startups (CGSS) provides credit guarantees to loans extended by member lending institutions (MLIs) to finance eligible borrowers, i.e., startups.',
    applicationUrl: 'https://dpiit.gov.in/',
    documents: ['DPIIT Recognition Certificate', 'Business Plan', 'Financial Statements']
  },
  {
    id: 3,
    title: 'PMEGP - Prime Minister\'s Employment Generation Programme',
    category: 'Financial Support',
    eligibility: 'Any individual above 18 years of age with 8th pass qualification',
    benefits: 'Subsidy up to 35% in urban and 25% in rural areas',
    deadline: 'Ongoing',
    industry: ['Manufacturing', 'Service', 'Retail'],
    scale: ['MSME', 'Small'],
    description: 'PMEGP is a credit-linked subsidy program aimed at generating self-employment opportunities through establishment of micro-enterprises in the non-farm sector.',
    applicationUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    documents: ['Identity Proof', 'Address Proof', 'Educational Qualification', 'Project Report']
  },
  {
    id: 4,
    title: 'MUDRA Loan Scheme',
    category: 'Loan',
    eligibility: 'Small business owners, entrepreneurs, and MSMEs',
    benefits: 'Loans up to ₹10 lakh without collateral',
    deadline: 'Ongoing',
    industry: ['All'],
    scale: ['MSME', 'Small'],
    description: 'Pradhan Mantri MUDRA Yojana (PMMY) provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises through MUDRA loans - Shishu, Kishore and Tarun.',
    applicationUrl: 'https://www.mudra.org.in/',
    documents: ['Identity Proof', 'Address Proof', 'Business Registration', 'Business Plan']
  },
  {
    id: 5,
    title: 'Stand-Up India',
    category: 'Financial Support',
    eligibility: 'SC/ST and Women entrepreneurs',
    benefits: 'Loans between ₹10 lakh and ₹1 crore',
    deadline: 'Ongoing',
    industry: ['All'],
    scale: ['MSME', 'Small', 'Medium'],
    description: 'Stand-Up India Scheme facilitates bank loans between ₹10 lakh and ₹1 crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch.',
    applicationUrl: 'https://www.standupmitra.in/',
    documents: ['Identity Proof', 'Address Proof', 'Caste Certificate (for SC/ST)', 'Business Plan']
  },
  {
    id: 6,
    title: 'MSME Technology Centre Scheme',
    category: 'Technology Support',
    eligibility: 'MSMEs in manufacturing sector',
    benefits: 'Access to advanced manufacturing technologies and training',
    deadline: 'Ongoing',
    industry: ['Manufacturing'],
    scale: ['MSME', 'Small', 'Medium'],
    description: 'MSME Technology Centres provide access to advanced manufacturing technologies, skilling manpower and providing technical and business advisory support to MSMEs.',
    applicationUrl: 'https://msme.gov.in/',
    documents: ['MSME Registration', 'Business Profile', 'Technology Requirement Details']
  },
  {
    id: 7,
    title: 'ZED Certification Scheme',
    category: 'Quality Certification',
    eligibility: 'Manufacturing MSMEs',
    benefits: 'Financial assistance for ZED certification, quality improvement',
    deadline: 'Ongoing',
    industry: ['Manufacturing'],
    scale: ['MSME', 'Small', 'Medium'],
    description: 'Zero Defect Zero Effect (ZED) Certification Scheme aims to develop and implement a rating system for MSMEs to make them quality conscious and encourage them to adopt Zero Defect Zero Effect practices.',
    applicationUrl: 'https://zed.msme.gov.in/',
    documents: ['MSME Registration', 'Manufacturing Process Details', 'Quality Management System Details']
  }
];

// Get all schemes (without filtering)
exports.getAllSchemes = async (req, res) => {
  try {
    res.status(200).json(governmentSchemes);
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({ message: 'Server error while fetching schemes' });
  }
};

// Get schemes based on business profile
exports.getMatchingSchemes = async (req, res) => {
  try {
    const { industryType, scale } = req.body;
    
    // If no profile data provided, try to get from user's business profile
    if (!industryType && !scale && req.userId) {
      const business = await Business.findOne({ user: req.userId });
      if (business) {
        req.body.industryType = business.industryType;
        req.body.scale = business.scale;
      }
    }

    // Filter schemes based on business profile
    let matchingSchemes = [...governmentSchemes];
    
    if (req.body.industryType) {
      matchingSchemes = matchingSchemes.filter(scheme => 
        scheme.industry.includes('All') || 
        scheme.industry.includes(req.body.industryType)
      );
    }
    
    if (req.body.scale) {
      matchingSchemes = matchingSchemes.filter(scheme => 
        scheme.scale.includes(req.body.scale)
      );
    }

    // Add a relevance score based on how well the scheme matches
    matchingSchemes = matchingSchemes.map(scheme => {
      let relevanceScore = 0;
      
      // Industry match
      if (req.body.industryType && scheme.industry.includes(req.body.industryType)) {
        relevanceScore += 5;
      } else if (scheme.industry.includes('All')) {
        relevanceScore += 3;
      }
      
      // Scale match
      if (req.body.scale && scheme.scale.includes(req.body.scale)) {
        relevanceScore += 5;
      }
      
      return {
        ...scheme,
        relevanceScore
      };
    });

    // Sort by relevance score (highest first)
    matchingSchemes.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.status(200).json(matchingSchemes);
  } catch (error) {
    console.error('Get matching schemes error:', error);
    res.status(500).json({ message: 'Server error while matching schemes' });
  }
};