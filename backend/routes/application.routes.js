// API routes for /api/applications
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes (require authentication)
router.post('/kya-results', authMiddleware, applicationController.getKYAResults);
router.post('/', authMiddleware, applicationController.createApplication);
router.get('/my-applications', authMiddleware, applicationController.getMyApplications);
router.get('/:id', authMiddleware, applicationController.getApplicationById);
router.put('/:id', authMiddleware, applicationController.updateApplication);
router.post('/:id/submit', authMiddleware, applicationController.submitApplication);
router.delete('/:id', authMiddleware, applicationController.deleteApplication);

// Public route for tracking applications
router.get('/track/:trackingId', applicationController.trackApplication);

module.exports = router;