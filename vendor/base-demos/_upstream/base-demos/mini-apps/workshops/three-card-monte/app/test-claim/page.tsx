"use client";

import { ClaimRewardButton } from "@/components/ClaimReward";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { color } from "@coinbase/onchainkit/theme";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";

function WalletComponents() {
  return (
    <div className="flex justify-end mb-8">
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}

export default function TestClaimPage() {
  return (
    <div className="container mx-auto p-8">
      <WalletComponents />

      <h1 className="text-2xl font-bold mb-6">Test Claim Reward</h1>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Claim Your Reward</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet and click the button below to claim your reward.
          </p>
          <ClaimRewardButton
            onSuccess={() => {
              console.log("Reward claimed successfully!");
            }}
          />
        </div>
      </div>
    </div>
  );
}
