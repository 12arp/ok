const express = require('express');
const router = express.Router();
const { submitForm, getSubmissions } = require('../controllers/formSubmission.controller');

// Log route registration
console.log('Setting up form routes...');

// Public route for form submission
router.post('/submit', (req, res, next) => {
    console.log('Received form submission request');
    console.log('Request body:', req.body);
    submitForm(req, res).catch(next);
});

// Protected route for admin to view submissions
router.get('/submissions', (req, res, next) => {
    console.log('Received request for form submissions');
    getSubmissions(req, res).catch(next);
});

module.exports = router; 