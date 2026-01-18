"use client";

import { ListItem } from "@worldcoin/mini-apps-ui-kit-react";
import { WalletActionDefinition, WalletPageType } from "~/types";
import { WalletConnect } from "~/components/wallet/wallet-actions";

interface WalletListProps {
  walletActions: WalletActionDefinition[];
  onWalletActionSelect: (walletActionId: WalletPageType) => void;
}

export function WalletList({ walletActions, onWalletActionSelect }: WalletListProps) {
  return (
    <div className="space-y-4">
      <WalletConnect />
      
      <div className="space-y-2">
        {walletActions.map((walletAction) => {
          const IconComponent = walletAction.icon;
          return (
            <ListItem
              key={walletAction.id}
              onClick={() => onWalletActionSelect(walletAction.id)}
              label={walletAction.name}
              description={walletAction.description}
              startAdornment={<IconComponent width={20} height={20} />}
            />
          );
        })}
      </div>
    </div>
  );
}
