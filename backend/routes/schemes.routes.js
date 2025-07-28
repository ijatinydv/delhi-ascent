// API routes for /api/schemes
const express = require('express');
const router = express.Router();
const schemesController = require('../controllers/schemes.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/', schemesController.getAllSchemes);

// Route that can use authentication if available but works without it too
router.post('/match', (req, res, next) => {
  // Try to authenticate but continue even if not authenticated
  if (req.headers.authorization) {
    authMiddleware(req, res, next);
  } else {
    next();
  }
}, schemesController.getMatchingSchemes);

module.exports = router;