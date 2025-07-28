// API routes for /api/business
const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes (require authentication)
router.post('/', authMiddleware, businessController.createBusiness);
router.get('/my-business', authMiddleware, businessController.getMyBusiness);
router.put('/', authMiddleware, businessController.updateBusiness);
router.delete('/', authMiddleware, businessController.deleteBusiness);

// Public routes
router.get('/all', businessController.getAllBusinesses);
router.get('/:id', businessController.getBusinessById);

module.exports = router;