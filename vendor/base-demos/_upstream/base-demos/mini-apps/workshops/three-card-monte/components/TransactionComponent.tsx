"use client";

import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useNotification } from "@coinbase/onchainkit/minikit";

export function TransactionComponent() {
  const { address } = useAccount();

  // Example transaction call - sending 0 ETH to self
  const calls = useMemo(
    () =>
      address
        ? [
            {
              to: address as `0x${string}`,
              data: "0x" as `0x${string}`,
              value: BigInt(0),
            },
          ]
        : [],
    [address],
  );

  const sendNotification = useNotification();

  const handleSuccess = useCallback(
    async (response: TransactionResponse) => {
      const transactionHash = response.transactionReceipts[0].transactionHash;

      console.log(`Transaction successful: ${transactionHash}`);

      await sendNotification({
        title: "Congratulations!",
        body: `You sent your a transaction, ${transactionHash}!`,
      });
    },
    [sendNotification],
  );

  return (
    <div className="flex flex-col items-center">
      {address ? (
        <Transaction
          calls={calls}
          onSuccess={handleSuccess}
          onError={(error: TransactionError) =>
            console.error("Transaction failed:", error)
          }
        >
          <TransactionButton className="bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white py-2 px-4 rounded-md text-sm font-medium" />
          <TransactionStatus>
            <TransactionStatusAction />
            <TransactionStatusLabel />
          </TransactionStatus>
          <TransactionToast className="mb-4">
            <TransactionToastIcon />
            <TransactionToastLabel />
            <TransactionToastAction />
          </TransactionToast>
        </Transaction>
      ) : (
        <ConnectWallet>
          <button className="bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white py-2 px-4 rounded-md text-sm font-medium">
            Connect Wallet
          </button>
        </ConnectWallet>
      )}
    </div>
  );
}
