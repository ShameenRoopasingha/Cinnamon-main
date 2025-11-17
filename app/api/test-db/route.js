import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('MongoDB test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
