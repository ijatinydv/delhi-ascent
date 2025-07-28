// API route for /api/chat
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes (no authentication required)
router.post('/query', chatbotController.processQuery);
router.post('/chat', chatbotController.processQuery); // New endpoint for /api/chat

// Optional authentication - will use user context if authenticated
router.use(async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from 'Bearer <token>'
      const token = authHeader.split(' ')[1];
      
      // Verify token
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add userId to request object
      req.userId = decoded.userId;
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
});

// Routes that work with or without authentication
router.get('/document-suggestions', chatbotController.getDocumentSuggestions);
router.post('/check-eligibility', chatbotController.checkEligibility);

module.exports = router;