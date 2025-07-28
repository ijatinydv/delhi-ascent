//Logic to handle requests to the AI assistant
const chatbotService = require('../services/chatbot.service');

// Process a user query and get a response from the AI assistant
exports.processQuery = async (req, res) => {
  try {
    const { query, businessType, applicationType, context } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Get user ID if authenticated
    const userId = req.userId || null;

    // Process the query using the chatbot service
    const response = await chatbotService.getResponse(query, {
      userId,
      businessType,
      applicationType,
      context
    });

    res.status(200).json({
      response,
      query
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Error processing your query' });
  }
};

// Get relevant document suggestions based on business type and application type
exports.getDocumentSuggestions = async (req, res) => {
  try {
    const { businessType, applicationType } = req.query;
    
    if (!businessType || !applicationType) {
      return res.status(400).json({ 
        message: 'Business type and application type are required' 
      });
    }

    // Get document suggestions from the chatbot service
    const suggestions = await chatbotService.getDocumentSuggestions(businessType, applicationType);

    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Document suggestions error:', error);
    res.status(500).json({ message: 'Error getting document suggestions' });
  }
};

// Get eligibility information for a specific license/permit
exports.checkEligibility = async (req, res) => {
  try {
    const { businessType, applicationType, businessDetails } = req.body;
    
    if (!businessType || !applicationType) {
      return res.status(400).json({ 
        message: 'Business type and application type are required' 
      });
    }

    // Check eligibility using the chatbot service
    const eligibility = await chatbotService.checkEligibility(
      businessType, 
      applicationType, 
      businessDetails
    );

    res.status(200).json(eligibility);
  } catch (error) {
    console.error('Eligibility check error:', error);
    res.status(500).json({ message: 'Error checking eligibility' });
  }
};