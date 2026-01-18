import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { kv } from '@vercel/kv';

// In-memory store for used nonces (fallback when Redis unavailable)
const usedNonces = new Set<string>();

/**
 * Check if Vercel KV is available
 */
function isKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Extract nonce from SIWE message
 */
function extractNonce(message: string): string | null {
  const match = message.match(/Nonce: ([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * POST /api/auth/verify
 * Verify a signed message using viem's verifyMessage
 */
export async function POST(request: NextRequest) {
  noStore();
  try {
    const body = await request.json();
    const { address, message, signature } = body;

    // Validate required fields
    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: 'Address, message, and signature are required' },
        { status: 400 }
      );
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

    // Extract nonce from message
    const nonce = extractNonce(message);
    if (!nonce) {
      return NextResponse.json(
        { error: 'No nonce found in message' },
        { status: 400 }
      );
    }

    // Check if nonce has been used before
    let nonceUsed = false;
    if (isKVAvailable()) {
      nonceUsed = await kv.exists(`used_nonce:${nonce}`) === 1;
    } else {
      nonceUsed = usedNonces.has(nonce);
    }

    if (nonceUsed) {
      return NextResponse.json(
        { error: 'Nonce has already been used' },
        { status: 400 }
      );
    }

    // Verify the message signature using viem
    // This supports both EOAs and Smart Contract Accounts (ERC-1271, ERC-6492, ERC-8010)

    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });
    
    const isValid = await publicClient.verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (isValid) {
      // Mark nonce as used (expire after 1 hour)
      if (isKVAvailable()) {
        await kv.set(`used_nonce:${nonce}`, '1', { ex: 3600 });
      } else {
        usedNonces.add(nonce);
      }

      return NextResponse.json({
        success: true,
        message: 'Signature verified successfully',
        address,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying message:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify signature',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

