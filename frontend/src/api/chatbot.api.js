import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chatbot';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Send a query to the chatbot
export const sendQuery = async (query, businessType = null, applicationType = null, userId = null) => {
  try {
    const response = await api.post('/chat', {
      query,
      businessType,
      applicationType,
      userId,
    });
    
    // Validate response structure
    if (!response.data) {
      throw new Error('Empty response received from server');
    }
    
    return {
      data: response.data
    };
  } catch (error) {
    console.error('Error sending query to chatbot:', error);
    // Return a structured error response instead of throwing
    // Check if the error response contains suggestions
    const suggestions = error.response?.data?.suggestions || [
      'What documents do I need for business registration?',
      'How do I register a food business in Delhi?',
      'What are the GST requirements for new businesses?'
    ];
    
    return {
      data: {
        response: {
          text: error.response?.data?.message || 'Failed to get response from chatbot. Please try again later.',
          source: 'system',
          suggestions: suggestions
        },
        query
      }
    };
  }
};

// Get document suggestions based on business type and application type
export const getDocumentSuggestions = async (businessType, applicationType) => {
  try {
    const response = await api.get('/document-suggestions', {
      params: {
        businessType,
        applicationType,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting document suggestions:', error);
    throw error.response?.data || { message: 'Failed to get document suggestions' };
  }
};

// Check eligibility for a license or permit
export const checkEligibility = async (businessType, applicationType, businessDetails) => {
  try {
    const response = await api.post('/check-eligibility', {
      businessType,
      applicationType,
      businessDetails,
    });
    return response.data;
  } catch (error) {
    console.error('Error checking eligibility:', error);
    throw error.response?.data || { message: 'Failed to check eligibility' };
  }
};

export default {
  sendQuery,
  getDocumentSuggestions,
  checkEligibility,
};