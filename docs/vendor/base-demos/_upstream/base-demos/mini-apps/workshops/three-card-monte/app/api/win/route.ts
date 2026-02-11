import { NextResponse } from "next/server";
import { createPublicClient, http, encodeFunctionData } from "viem";
import { baseSepolia } from "viem/chains";
import { GAME_CONTRACT_ADDRESS_SEPOLIA } from "@/lib/constants";
import { GAME_CONTRACT_ABI } from "@/lib/abi";
import { getCDPAccountByAddress } from "@/lib/cdp/account";
import { cdp } from "@/lib/cdp/client";

// Initialize the public client for transaction monitoring
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { playerAddress, score, gameId } = body;

    if (!playerAddress || !score || !gameId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Get the CDP account that will send the transaction
    const account = await getCDPAccountByAddress(
      "0x72CEf69033b684D46c684FA7292530e4b06Ad9BF", //process.env.CDP_SIGNER_ADDRESS!,
    );

    // Prepare the transaction
    const txData = encodeFunctionData({
      abi: GAME_CONTRACT_ABI,
      functionName: "recordReward",
      args: [playerAddress as `0x${string}`, true],
    });

    console.log("Sending transaction with data:", {
      to: GAME_CONTRACT_ADDRESS_SEPOLIA,
      data: txData,
      from: account.address,
    });

    const txResult = await cdp.evm.sendTransaction({
      address: account.address,
      network: "base-sepolia",
      transaction: {
        to: GAME_CONTRACT_ADDRESS_SEPOLIA as `0x${string}`,
        data: txData,
      },
    });

    console.log("Transaction sent:", {
      hash: txResult.transactionHash,
      network: "base-sepolia",
    });

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txResult.transactionHash,
    });

    console.log("Transaction receipt:", {
      hash: receipt.transactionHash,
      blockNumber: receipt.blockNumber.toString(),
      gasUsed: receipt.gasUsed.toString(),
    });

    return NextResponse.json({
      success: true,
      transactionHash: txResult.transactionHash,
    });
  } catch (error) {
    console.error("Error processing game win:", error);
    return NextResponse.json(
      {
        error: "Failed to process game win",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
