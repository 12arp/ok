const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// Create a new enquiry
router.post('/', enquiryController.createEnquiry);

// Get all enquiries (for admin)
router.get('/', enquiryController.getAllEnquiries);

// Update enquiry status (for admin)
router.patch('/:id', enquiryController.updateEnquiryStatus);

module.exports = router; 