const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please add a product description']
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex'],
      required: [true, 'Please select gender category']
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one product image']
    },
    colors: {
      type: [String],
      default: ['Black', 'White', 'Navy']
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'XXL']
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: 0,
      default: 10
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 12
    },
    featured: {
      type: Boolean,
      default: false
    },
    bestseller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Add index for search and fast filter queries
productSchema.index({ name: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
