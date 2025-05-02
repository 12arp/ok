import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true
        },
        image: {
            type: String,
            required: [true, "Main image is required"]
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
                required: true,
                trim: true
            },
            value: {
                type: String,
                required: true,
                trim: true
            }
        }],
        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model("Product", productSchema);