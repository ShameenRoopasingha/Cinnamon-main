import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      maxlength: [100, 'Product name cannot be more than 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Cinnamon Sticks', 'Cinnamon Powder', 'Cinnamon Oil', 'Cinnamon Tea', 'Other'],
      default: 'Other',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      default: 'kg',
      enum: ['kg', 'g', 'lb', 'oz', 'pcs', 'piece', 'pack'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product must belong to a vendor'],
    },
    images: [{
      type: String,
    }],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5'],
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'inactive', 'out-of-stock'],
      default: 'pending',
    },
    origin: {
      type: String,
      default: 'Sri Lanka',
    },
    certifications: [{
      type: String,
    }],
    specifications: {
      origin: String,
      grade: String,
      moisture: String,
      oilContent: String,
    },
    vendorName: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
ProductSchema.index({ vendor: 1 })
ProductSchema.index({ category: 1 })
ProductSchema.index({ status: 1 })
ProductSchema.index({ name: 'text', description: 'text' })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
