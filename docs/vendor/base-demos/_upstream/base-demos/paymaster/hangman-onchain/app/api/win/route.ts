import { NextResponse } from 'next/server';
import { createPublicClient, http, encodeFunctionData } from 'viem';
import { base } from 'viem/chains';
//import { GAME_CONTRACT_ADDRESS } from '@/app/utils/constants';
import { GAME_CONTRACT_ABI } from '@/app/utils/abis/AirdropABI';
import { getCDPAccountByAddress } from '@/lib/cdp/account';
import { cdp } from '@/lib/cdp/client';

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerAddress, score, gameId } = body;

    console.log('Incoming win request:', { playerAddress, score, gameId });

    if (!playerAddress || !score || !gameId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const account = await getCDPAccountByAddress(
      process.env.CDP_SIGNER_ADDRESS!
    );

    console.log('Preparing to call contract:', {
      contractAddress: '0x9a68a6af680e33c59b7e1c34ecc8bbedf6b5b75b',
      functionName: 'recordReward',
      cdpSigner: account.address,
    });

    const txData = encodeFunctionData({
      abi: GAME_CONTRACT_ABI,
      functionName: 'recordReward',
      args: [playerAddress as `0x${string}`, true],
    });

    const txResult = await cdp.evm.sendTransaction({
      address: account.address,
      network: 'base',
      transaction: {
        to: '0x9a68a6af680e33c59b7e1c34ecc8bbedf6b5b75b' as `0x${string}`,
        data: txData,
      },
    });

    console.log('Game win transaction hash:', txResult.transactionHash);

    await publicClient.waitForTransactionReceipt({
      hash: txResult.transactionHash,
    });

    return NextResponse.json({
      success: true,
      transactionHash: txResult.transactionHash,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to process game win',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
