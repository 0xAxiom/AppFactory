import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

// Request schema
const FinalizeRequestSchema = z.object({
  launch_id: z.string().startsWith('ln_'),
  signed_transaction: z.string().min(1),
});

// Showcase storage (in-memory for demo, use database in production)
const showcaseApps = new Map<
  string,
  {
    id: string;
    name: string;
    description: string;
    ticker: string;
    token_address: string;
    creator_wallet: string;
    draft_url: string;
    production_url: string | null;
    status: 'draft' | 'deployed';
    twitter: string | null;
    website: string | null;
    created_at: string;
  }
>();

// Launches storage (shared with prepare route - in production use database)
const launches = new Map<
  string,
  {
    id: string;
    upload_id: string;
    wallet_address: string;
    metadata: {
      name: string;
      description: string;
      ticker: string;
      twitter?: string;
      website?: string;
    };
    status: 'prepared' | 'finalized' | 'failed';
    created_at: string;
    transaction_data?: string;
    token_address?: string;
  }
>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const parseResult = FinalizeRequestSchema.safeParse(body);
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

    const { launch_id, signed_transaction } = parseResult.data;

    // Get launch record
    const launch = launches.get(launch_id);
    if (!launch) {
      return NextResponse.json(
        {
          success: false,
          error: 'launch_not_found',
          message: 'Launch not found. Did you call /api/launch/prepare first?',
        },
        { status: 404 }
      );
    }

    // Check if already finalized (idempotency)
    if (launch.status === 'finalized' && launch.token_address) {
      const existingApp = Array.from(showcaseApps.values()).find(
        (app) => app.token_address === launch.token_address
      );

      return NextResponse.json({
        success: true,
        message: 'Launch already finalized',
        token: {
          address: launch.token_address,
          name: launch.metadata.name,
          symbol: launch.metadata.ticker,
        },
        deployment: existingApp
          ? {
              url: existingApp.draft_url,
              status: existingApp.status,
            }
          : null,
      });
    }

    // In production:
    // 1. Submit signed transaction to Solana
    // 2. Wait for confirmation
    // 3. Extract token address from transaction result
    // 4. Deploy app to Vercel
    // 5. Update database records

    // Simulate token creation
    const tokenAddress = `${crypto.randomBytes(32).toString('hex').slice(0, 44)}`;
    const transactionId = `${crypto.randomBytes(32).toString('hex').slice(0, 88)}`;

    // Update launch status
    launch.status = 'finalized';
    launch.token_address = tokenAddress;
    launches.set(launch_id, launch);

    // Simulate Vercel deployment
    const appSlug = launch.metadata.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const draftUrl = `https://${appSlug}.vercel.app`;
    const deploymentId = `dpl_${crypto.randomBytes(12).toString('hex')}`;

    // Create showcase entry
    const showcaseId = `app_${appSlug}`;
    showcaseApps.set(showcaseId, {
      id: showcaseId,
      name: launch.metadata.name,
      description: launch.metadata.description,
      ticker: launch.metadata.ticker,
      token_address: tokenAddress,
      creator_wallet: launch.wallet_address,
      draft_url: draftUrl,
      production_url: null,
      status: 'draft',
      twitter: launch.metadata.twitter || null,
      website: launch.metadata.website || null,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      token: {
        address: tokenAddress,
        name: launch.metadata.name,
        symbol: launch.metadata.ticker,
        transaction_id: transactionId,
      },
      deployment: {
        url: draftUrl,
        status: 'draft',
        deployment_id: deploymentId,
      },
      showcase: {
        id: showcaseId,
        url: `https://appfactory.build/showcase/${appSlug}`,
      },
    });
  } catch (error) {
    console.error('Finalize launch error:', error);
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

// Export for showcase route
export { showcaseApps };
