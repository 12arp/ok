const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
       
            type: String, 
            required: [true, 'English title is required'],
            trim: true,
            minlength: [3, 'English title must be at least 3 characters long']
       
       
    },
    description: {
        
            type: String, 
            required: [true, 'English description is required'],
            trim: true,
            minlength: [10, 'English description must be at least 10 characters long']
       
    },
    image: { 
        type: String, 
        required: [true, 'Main image is required']
    },
    additionalImages: [{ 
        type: String 
    }],
    features: [{ 
        type: String,
        trim: true
    }],
    specifications: [{
        name: { 
            type: String, 
            required: [true, 'Specification name is required'],
            trim: true
        },
        value: { 
            type: String, 
            required: [true, 'Specification value is required'],
            trim: true
        }
    }],
    isFeatured: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Add indexes for better query performance
productSchema.index({ 'title.en': 'text', 'title.hi': 'text' });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// Add static method to find featured products
productSchema.statics.findFeatured = function() {
    return this.find({ isFeatured: true }).sort({ createdAt: -1 });
};

// Add instance method to get product summary
productSchema.methods.getSummary = function() {
    return {
        id: this._id,
        title: this.title,
        image: this.image,
        isFeatured: this.isFeatured
    };
};

const Product = mongoose.model('Product', productSchema);

// Add error handling for model operations
Product.on('error', function(error) {
    console.error('Product model error:', error);
});

module.exports = Product; 