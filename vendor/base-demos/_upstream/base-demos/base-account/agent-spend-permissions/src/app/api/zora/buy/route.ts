import { NextRequest, NextResponse } from 'next/server'
import { lookupZoraProfile } from '@/lib/zora'

import { getServerWalletForUser, getCdpClient } from '@/lib/cdp'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'


export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const session = request.cookies.get('session')?.value
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Decode user address from session
    const [userAddress] = Buffer.from(session, 'base64').toString().split(':')
    if (!userAddress) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const { zoraHandle, amountUSD, spendCalls } = await request.json()

    if (!zoraHandle || !amountUSD || !spendCalls) {
      return NextResponse.json({ error: 'Missing zoraHandle, amountUSD, or spendCalls' }, { status: 400 })
    }

    if (amountUSD <= 0 || amountUSD > 100) {
      return NextResponse.json({ error: 'Amount must be between $0.01 and $100' }, { status: 400 })
    }

    // Get existing server wallet
    const serverWallet = getServerWalletForUser(userAddress)
    if (!serverWallet) {
      return NextResponse.json({ 
        error: 'Server wallet not found in memory (possibly due to server restart). Please re-setup your spend permissions.' 
      }, { status: 400 })
    }

    console.log(`Processing Zora coin purchase: $${amountUSD} for ${zoraHandle}`)

    // Execute spend permission calls using CDP's sendUserOperation with gas sponsorship
    if (!serverWallet.smartAccount) {
      return NextResponse.json({ 
        error: 'Smart account not found. Please re-setup your spend permissions.' 
      }, { status: 400 })
    }

    const cdpClient = getCdpClient();
    console.log('🔧 Sending user operation with spend calls:', spendCalls)
    await cdpClient.evm.sendUserOperation({
      smartAccount: serverWallet.smartAccount,
      network: "base",
      calls: spendCalls.map((call: any) => ({
        to: call.to,
        data: call.data,
      })),
      paymasterUrl: process.env.PAYMASTER_URL,
    })

    // Lookup Zora profile
    const profile = await lookupZoraProfile(zoraHandle)
    if (!profile) {
      return NextResponse.json({ error: `Zora profile not found for handle: ${zoraHandle}` }, { status: 404 })
    }

    if (!profile.creatorCoin) {
      return NextResponse.json({ error: `No creator coin found for ${profile.handle}` }, { status: 400 })
    }

    // Use CDP's built-in swap functionality instead of complex Zora quote handling
    const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
    const requiredAmountUSDC = BigInt(Math.floor(amountUSD * 1_000_000));

    let approvalReceipt, tradeReceipt;

    try {
      // First, approve Permit2 contract to spend USDC
      const PERMIT2_ADDRESS = '0x000000000022d473030f116ddee9f6b43ac78ba3';
      const approveSelector = '0x095ea7b3';
      const spenderAddress = PERMIT2_ADDRESS.slice(2).padStart(64, '0');
      const maxApprovalAmount = 'f'.repeat(64); // Max uint256
      const approveData = `${approveSelector}${spenderAddress}${maxApprovalAmount}`;

      approvalReceipt = await cdpClient.evm.sendUserOperation({
        smartAccount: serverWallet.smartAccount,
        network: "base",
        calls: [
          {
            to: USDC_BASE_ADDRESS as `0x${string}`,
            data: approveData as `0x${string}`,
          }
        ],
        paymasterUrl: process.env.PAYMASTER_URL,
      });

      // Wait for approval to be confirmed on-chain
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Execute the swap with retry logic (max 3 attempts)
      let swapResult;
      let receipt;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          swapResult = await serverWallet.smartAccount.swap({
            network: "base",
            fromToken: USDC_BASE_ADDRESS,
            toToken: profile.creatorCoin.address,
            fromAmount: requiredAmountUSDC,
            slippageBps: 500,
            paymasterUrl: process.env.PAYMASTER_URL,
          });

          receipt = await serverWallet.smartAccount.waitForUserOperation({
            userOpHash: swapResult.userOpHash,
          });

          if (receipt.status === 'complete') {
            break; // Success, exit retry loop
          } else {
            if (attempt === maxRetries) {
              return NextResponse.json({ 
                error: `Swap failed after ${maxRetries} attempts with status: ${receipt.status}` 
              }, { status: 500 });
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (swapError) {
          if (attempt === maxRetries) {
            throw swapError;
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // At this point, we know the swap succeeded
      tradeReceipt = receipt.transactionHash;

      // Transfer all creator coin balance from smart account to user's wallet
      try {
        const publicClient = createPublicClient({
          chain: base,
          transport: http(),
        });

        const creatorCoinBalance = await publicClient.readContract({
          address: profile.creatorCoin.address as `0x${string}`,
          abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] }],
          functionName: 'balanceOf',
          args: [serverWallet.smartAccount.address],
        });

        if (creatorCoinBalance > 0) {
          const transferSelector = '0xa9059cbb';
          const recipientAddress = userAddress.slice(2).padStart(64, '0');
          const transferAmount = (creatorCoinBalance as bigint).toString(16).padStart(64, '0');
          const transferData = `${transferSelector}${recipientAddress}${transferAmount}`;

          await cdpClient.evm.sendUserOperation({
            smartAccount: serverWallet.smartAccount,
            network: "base",
            calls: [
              {
                to: profile.creatorCoin.address as `0x${string}`,
                data: transferData as `0x${string}`,
              }
            ],
            paymasterUrl: process.env.PAYMASTER_URL,
          });
        }
      } catch (transferError) {
        console.error('Failed to transfer creator coins to user:', transferError);
      }

    } catch (error) {
      console.error('Creator coin swap error:', error);
      return NextResponse.json({ 
        error: 'Failed to execute creator coin swap' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        handle: profile.handle,
        displayName: profile.displayName,
        creatorCoinAddress: profile.creatorCoin.address,
      },
      purchase: {
        amountUSD,
        approvalTransactionHash: approvalReceipt,
        tradeTransactionHash: tradeReceipt,
      },
      redirect: {
        url: 'https://account.base.app/activity',
        message: 'View your transaction activity on Base Account'
      },
      message: `✅ Successfully bought $${amountUSD} worth of ${profile.handle}'s creator coin! The tokens have been transferred to your wallet. Check your activity at account.base.app/activity to see the transaction.`
    })
  } catch (error) {
    console.error('Zora coin purchase error:', error)
    return NextResponse.json({ error: 'Failed to purchase Zora coin' }, { status: 500 })
  }
}