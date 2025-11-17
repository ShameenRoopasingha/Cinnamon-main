import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export const dynamic = 'force-dynamic'

// GET /api/users - Get all users
export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    
    const query = role ? { role } : {}
    const users = await User.find(query).select('-password')
    
    return NextResponse.json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    await connectDB()
    
    const user = await User.create(body)
    
    // Remove password from response
    const userObject = user.toObject()
    delete userObject.password
    
    return NextResponse.json(
      {
        success: true,
        data: userObject,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create user. Please try again.' },
      { status: 500 }
    )
  }
}
