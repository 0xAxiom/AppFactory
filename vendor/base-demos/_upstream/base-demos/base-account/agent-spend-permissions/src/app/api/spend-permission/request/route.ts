import { NextRequest, NextResponse } from 'next/server'

// This endpoint is no longer needed since spend permissions are handled on the frontend
// Keeping it as a placeholder for potential future use

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Spend permissions are now handled on the frontend' 
  }, { status: 200 })
}