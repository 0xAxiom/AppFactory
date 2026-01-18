"use client";

import React, { useState } from "react";
import { requestSpendPermission } from "@base-org/account/spend-permission";
import { createBaseAccountSDK } from "@base-org/account";

interface SpendPermissionSetupProps {
  userAddress: string;
  onPermissionGranted: () => void;
}

export function SpendPermissionSetup({
  userAddress,
  onPermissionGranted,
}: SpendPermissionSetupProps) {
  const [dailyLimit, setDailyLimit] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSetupPermission = async () => {
    setIsLoading(true);
    setError("");

    try {
      // First create server wallet to get the spender address
      const walletResponse = await fetch("/api/wallet/create", {
        method: "POST",
      });

      if (!walletResponse.ok) {
        throw new Error("Failed to create server wallet");
      }

      const walletData = await walletResponse.json();
      const spenderAddress = walletData.smartAccountAddress;

      if (!spenderAddress) {
        throw new Error("Smart account address not found");
      }

      console.log("Smart account address (spender):", spenderAddress);
      console.log("Server wallet address:", walletData.serverWalletAddress);

      // USDC address on Base mainnet
      const USDC_BASE_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

      // Convert USD to USDC (6 decimals)
      const allowanceUSDC = BigInt(dailyLimit * 1_000_000);

      // Request spend permission from user's wallet (this requires user signature)
      console.log("Requesting spend permission from user...");
      const permission = await requestSpendPermission({
        account: userAddress as `0x${string}`,
        spender: spenderAddress as `0x${string}`,
        token: USDC_BASE_ADDRESS as `0x${string}`,
        chainId: 8453, // Base mainnet
        allowance: allowanceUSDC,
        periodInDays: 1, // Daily limit
        provider: createBaseAccountSDK({
          appName: "Zora Creator Coins Agent",
        }).getProvider(),
      });

      console.log("Spend permission granted:", permission);

      // Store the permission for later use
      localStorage.setItem("spendPermission", JSON.stringify(permission));
      
      onPermissionGranted();
    } catch (error) {
      console.error("Permission setup error:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Set Up Spend Permissions
      </h3>

      <p className="text-gray-600 text-sm mb-6">
        To use the Zora Coins Agent, you need to grant spend permissions. This
        allows the agent to purchase coins on your behalf using your USDC.
      </p>


      <div className="space-y-4">
        <div>
          <label
            htmlFor="dailyLimit"
            className="block text-sm font-medium text-gray-700"
          >
            Daily Spend Permission (USD)
          </label>
          <div className="mt-1">
            <input
              type="range"
              id="dailyLimit"
              min="1"
              max="2"
              step="0.1"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$1.00</span>
              <span className="font-medium text-base-blue">${dailyLimit.toFixed(2)}</span>
              <span>$2.00</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleSetupPermission}
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-base-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-base-blue disabled:opacity-50"
        >
          {isLoading
            ? "Setting up..."
            : `Grant $${dailyLimit.toFixed(2)}/day Spend Permission`}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          💡 This creates a secure spend permission that allows the agent to
          spend up to ${dailyLimit.toFixed(2)} per day from your wallet to buy Zora coins.
          Gas fees are sponsored automatically.
        </p>
      </div>
    </div>
  );
}
