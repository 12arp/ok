const FormSubmission = require('../models/FormSubmission');

exports.submitForm = async (req, res) => {
    try {
        console.log('Received form submission:', req.body);
        
        const { name, email, phone, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !phone || !message) {
            console.log('Missing required fields:', { name, email, phone, message });
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const submission = new FormSubmission({
            name,
            email,
            phone,
            message
        });

        await submission.save();
        console.log('Form submission saved successfully:', submission);

        res.status(201).json({
            success: true,
            message: 'Form submitted successfully',
            data: submission
        });
    } catch (error) {
        console.error('Form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting form',
            error: error.message
        });
    }
};

exports.getSubmissions = async (req, res) => {
    try {
        const submissions = await FormSubmission.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: submissions
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching form submissions',
            error: error.message
        });
    }
}; 