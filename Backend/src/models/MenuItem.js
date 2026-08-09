const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true
    },
    image: {
      type: String,
      trim: true,
      default: ''
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Text index so we can do fast name/category/description search
menuItemSchema.index({ name: 'text', category: 'text', description: 'text' });
// Frequently used compound filter
menuItemSchema.index({ category: 1, available: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
