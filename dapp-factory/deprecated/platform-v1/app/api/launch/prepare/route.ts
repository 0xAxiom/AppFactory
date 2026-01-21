import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

// Hardcoded partner key (security: never expose this pattern in client code)
const PARTNER_KEY = 'FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7';
const FEE_SPLIT = { creator: 75, partner: 25 };

// Request schema
const PrepareRequestSchema = z.object({
  upload_id: z.string().startsWith('up_'),
  wallet_address: z.string().min(32).max(44),
  metadata: z.object({
    name: z.string().min(1).max(50),
    description: z.string().min(1).max(500),
    ticker: z.string().min(3).max(6).toUpperCase(),
    twitter: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
  }),
});

// Launch storage (in-memory for demo, use database in production)
const launches = new Map<
  string,
  {
    id: string;
    upload_id: string;
    wallet_address: string;
    metadata: z.infer<typeof PrepareRequestSchema>['metadata'];
    status: 'prepared' | 'finalized' | 'failed';
    created_at: string;
    transaction_data?: string;
    token_address?: string;
  }
>();

// Rate limiting
const launchAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // launches per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(wallet: string): boolean {
  const now = Date.now();
  const record = launchAttempts.get(wallet);

  if (!record || now > record.resetAt) {
    launchAttempts.set(wallet, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Idempotency: check if launch already exists for this upload
function getExistingLaunch(uploadId: string): string | null {
  for (const [launchId, launch] of launches) {
    if (launch.upload_id === uploadId) {
      return launchId;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const parseResult = PrepareRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'validation_error',
          details: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { upload_id, wallet_address, metadata } = parseResult.data;

    // Rate limiting
    if (!checkRateLimit(wallet_address)) {
      return NextResponse.json(
        {
          success: false,
          error: 'rate_limited',
          message: 'Too many launch attempts. Please wait an hour.',
        },
        { status: 429 }
      );
    }

    // Idempotency: return existing launch if already prepared
    const existingLaunchId = getExistingLaunch(upload_id);
    if (existingLaunchId) {
      const existingLaunch = launches.get(existingLaunchId)!;
      return NextResponse.json({
        success: true,
        launch_id: existingLaunchId,
        status: existingLaunch.status,
        message: 'Launch already prepared',
        transaction: {
          serialized: existingLaunch.transaction_data || 'simulated_tx_data',
          message: `Create ${metadata.ticker} token with ${FEE_SPLIT.creator}/${FEE_SPLIT.partner} fee split`,
        },
      });
    }

    // In production:
    // 1. Call Bags API with server-side API key
    // 2. Get unsigned transaction for token creation
    // 3. Apply partner fee split configuration
    // 4. Return serialized transaction for wallet signing

    // Generate launch ID
    const launchId = `ln_${crypto.randomBytes(12).toString('hex')}`;

    // Simulate transaction preparation
    const transactionData = Buffer.from(
      JSON.stringify({
        type: 'token_create',
        name: metadata.name,
        symbol: metadata.ticker,
        fee_split: FEE_SPLIT,
        partner_key: PARTNER_KEY,
        creator: wallet_address,
      })
    ).toString('base64');

    // Store launch record
    launches.set(launchId, {
      id: launchId,
      upload_id,
      wallet_address,
      metadata,
      status: 'prepared',
      created_at: new Date().toISOString(),
      transaction_data: transactionData,
    });

    return NextResponse.json({
      success: true,
      launch_id: launchId,
      transaction: {
        serialized: transactionData,
        message: `Create ${metadata.ticker} token with ${FEE_SPLIT.creator}/${FEE_SPLIT.partner} fee split`,
      },
      preview: {
        token_name: metadata.name,
        token_symbol: metadata.ticker,
        fee_split: {
          creator: `${FEE_SPLIT.creator}%`,
          app_factory: `${FEE_SPLIT.partner}%`,
        },
      },
    });
  } catch (error) {
    console.error('Prepare launch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'server_error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

// Export launches map for finalize route
export { launches };
