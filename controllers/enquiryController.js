const Enquiry = require('../models/Enquiry');

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            message,
            productId,
            productName
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !productId || !productName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create new enquiry
        const enquiry = new Enquiry({
            name,
            email,
            phone,
            message,
            productId,
            productName
        });

        // Save enquiry
        await enquiry.save();

        // Send email notification (you can implement this later)
        // await sendEnquiryNotification(enquiry);

        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully',
            data: enquiry
        });
    } catch (error) {
        console.error('Error creating enquiry:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error submitting enquiry'
        });
    }
};

// Get all enquiries (for admin)
exports.getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: enquiries
        });
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching enquiries'
        });
    }
};

// Update enquiry status (for admin)
exports.updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: enquiry
        });
    } catch (error) {
        console.error('Error updating enquiry:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating enquiry'
        });
    }
}; 