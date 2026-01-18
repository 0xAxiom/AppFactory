"use client";

import { Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { WalletConnect } from "~/components/wallet/wallet-actions";

export function WalletConnectPrompt() {
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-[60vh]">
      <div className="mb-4">
        <Typography variant="heading" className="text-lg font-semibold text-foreground mb-2">Connect Your Wallet</Typography>
        <Typography variant="body" className="text-sm text-muted-foreground mb-6">
          Connect your wallet to access all features
        </Typography>
      </div>
      <WalletConnect />
    </div>
  );
}
