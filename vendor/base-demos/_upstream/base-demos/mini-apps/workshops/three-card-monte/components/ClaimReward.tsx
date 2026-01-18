"use client";

import { useAccount, useSwitchChain, createConfig, http } from "wagmi";
import { useState } from "react";
import { baseSepolia } from "viem/chains";
import { encodeFunctionData } from "viem";
import { useSendCalls } from "wagmi/experimental";
import { GAME_CONTRACT_ABI } from "@/lib/abi";
import {
  GAME_CONTRACT_ADDRESS_SEPOLIA,
  PAYMASTER_URL_SEPOLIA,
} from "@/lib/constants";

interface ClaimRewardButtonProps {
  onSuccess?: () => void;
}

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(PAYMASTER_URL_SEPOLIA || ""),
  },
});

export function ClaimRewardButton({ onSuccess }: ClaimRewardButtonProps) {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { switchChain } = useSwitchChain();
  const { sendCalls } = useSendCalls({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Error claiming reward:", error);
        setError("Failed to claim reward. Please try again.");
      },
    },
  });

  const handleClaim = async () => {
    if (!account.isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!account.chainId) {
      setError("Please connect to Base Sepolia network");
      return;
    }

    if (account.chainId !== baseSepolia.id) {
      switchChain({ chainId: baseSepolia.id });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = encodeFunctionData({
        abi: GAME_CONTRACT_ABI,
        functionName: "claimReward",
        args: [true], // true for ETH rewards
      });

      const calls = [
        {
          to: GAME_CONTRACT_ADDRESS_SEPOLIA,
          data,
        },
      ];

      sendCalls({
        calls,
        capabilities: {
          paymasterService: {
            url: PAYMASTER_URL_SEPOLIA || "",
          },
        },
      });
    } catch (err) {
      console.error("Error claiming reward:", err);
      setError("Failed to claim reward. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4">
          <p className="text-green-500">Reward claimed successfully! 🎉</p>
        </div>
      )}
      <button
        onClick={handleClaim}
        disabled={isLoading || !account.isConnected}
        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Claiming Reward...
          </div>
        ) : !account.isConnected ? (
          "Connect Wallet"
        ) : (
          "Claim Reward"
        )}
      </button>
    </div>
  );
}
