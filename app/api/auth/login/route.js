import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Find user by email and include password for comparison
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // For now, do simple password comparison
    // TODO: Use bcrypt to compare hashed passwords
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create user response (exclude password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessName: user.businessName,
      address: user.address,
      phone: user.phone,
      profileImage: user.profileImage
    }

    // Create a simple token (user ID + role)
    // TODO: Use JWT for better security
    const token = Buffer.from(JSON.stringify({ 
      userId: user._id, 
      role: user.role 
    })).toString('base64')

    // Create response with cookies
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    })

    // Set cookies for middleware authentication
    response.cookies.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    response.cookies.set('user', JSON.stringify(userResponse), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error during login' },
      { status: 500 }
    )
  }
}
