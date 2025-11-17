import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

// GET /api/products - Get all products
export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const vendor = searchParams.get('vendor')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    const query = {}
    if (vendor) query.vendor = vendor
    if (category) query.category = category
    if (status) query.status = status
    if (search) {
      query.$text = { $search: search }
    }
    
    const products = await Product.find(query)
      .populate('vendor', 'name businessName email')
      .sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const product = await Product.create(body)
    
    const populatedProduct = await Product.findById(product._id)
      .populate('vendor', 'name businessName email')
    
    return NextResponse.json(
      {
        success: true,
        data: populatedProduct,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
