import { NextRequest, NextResponse } from 'next/server'
import { createServerWalletForUser, getServerWalletForUser } from '@/lib/cdp'

export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const session = request.cookies.get('session')?.value
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Decode user address from session (simplified)
    const [userAddress] = Buffer.from(session, 'base64').toString().split(':')
    if (!userAddress) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Get or create server wallet for user
    let serverWallet = getServerWalletForUser(userAddress)
    if (!serverWallet?.smartAccount) {
      serverWallet = await createServerWalletForUser(userAddress)
    }

    return NextResponse.json({
      ok: true,
      serverWalletAddress: serverWallet.address,
      smartAccountAddress: serverWallet.smartAccount?.address,
      message: 'Server wallet ready'
    })
  } catch (error) {
    console.error('Server wallet creation error:', error)
    return NextResponse.json({ error: 'Failed to create server wallet' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const session = request.cookies.get('session')?.value
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Decode user address from session (simplified)
    const [userAddress] = Buffer.from(session, 'base64').toString().split(':')
    if (!userAddress) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Get existing server wallet for user
    const serverWallet = getServerWalletForUser(userAddress)
    
    return NextResponse.json({
      ok: true,
      serverWalletAddress: serverWallet?.address || null,
      smartAccountAddress: serverWallet?.smartAccount?.address || null,
      exists: !!serverWallet
    })
  } catch (error) {
    console.error('Server wallet fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch server wallet' }, { status: 500 })
  }
}