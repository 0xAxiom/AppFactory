"use client";

import { Button, Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { WalletActionDefinition, WalletPageType } from "~/types";
import { HapticWrapper } from "~/components/haptic-wrapper";

interface WalletDetailProps {
  currentWalletPage: WalletPageType;
  walletActionDefinitions: WalletActionDefinition[];
  onBack: () => void;
}

export function WalletDetail({ currentWalletPage, walletActionDefinitions, onBack }: WalletDetailProps) {
  const currentWalletAction = walletActionDefinitions.find(a => a.id === currentWalletPage);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <HapticWrapper onClick={onBack} hapticType="impact">
          <Button
            variant="secondary"
            size="sm"
            className="p-2"
          >
            <span className="text-muted-foreground">←</span>
          </Button>
        </HapticWrapper>
        <Typography variant="heading" className="font-semibold text-foreground">
          {currentWalletAction?.name}
        </Typography>
      </div>
      <div className="border border-border rounded-lg p-4 bg-white">
        {(() => {
          if (currentWalletAction) {
            const Component = currentWalletAction.component;
            return <Component />;
          }
          return null;
        })()}
      </div>
    </div>
  );
}
