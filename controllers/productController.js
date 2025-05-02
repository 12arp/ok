const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products'
        });
    }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.findFeatured();
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products'
        });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error fetching product'
        });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            image,
            additionalImages,
            features,
            specifications,
            isFeatured
        } = req.body;

        // Validate required fields
        if (!title || !description || !image) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title, description, and image are required'
            });
        }

        // Create new product
        const product = new Product({
            title,
            description,
            image,
            additionalImages: additionalImages || [],
            features: features || [],
            specifications: specifications || [],
            isFeatured: isFeatured || false
        });

        // Save product
        await product.save();

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating product'
        });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            image, 
            additionalImages, 
            features, 
            specifications, 
            isFeatured 
        } = req.body;
        
        // Prepare update object
        const updateData = {
            updatedAt: Date.now()
        };

        // Only include fields that are provided
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (image) updateData.image = image;
        if (additionalImages) updateData.additionalImages = additionalImages;
        if (features) updateData.features = features;
        if (specifications) updateData.specifications = specifications;
        if (typeof isFeatured === 'boolean') updateData.isFeatured = isFeatured;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating product'
        });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error deleting product'
        });
    }
}; 