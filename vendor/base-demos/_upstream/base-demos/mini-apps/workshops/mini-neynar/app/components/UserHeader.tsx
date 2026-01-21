"use client";

import {
  ConnectWallet,
  ConnectWalletText,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Avatar,
  Name,
  Address,
  EthBalance,
  Identity,
  Badge,
} from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";

interface UserHeaderProps {
  username: string;
  fid?: number;
  schemaId?: `0x${string}`;
}

export default function UserHeader({
  username,
  fid,
  schemaId,
}: UserHeaderProps) {
  const { address } = useAccount();

  return (
    <div className="w-full py-2 px-3 bg-[#F9F9F9] rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* User information section */}
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">@{username}</span>
          {fid && <span className="text-xs text-gray-500">FID: {fid}</span>}
        </div>
      </div>

      {/* Wallet control section */}
      <Wallet className="[&>div:nth-child(2)]:!opacity-100">
        <ConnectWallet className="bg-[#0052FF] hover:bg-[#0049E5] text-white font-medium py-1 px-3 text-sm rounded-lg transition-colors flex items-center">
          <Avatar className="h-5 w-5 mr-2" />
          <ConnectWalletText>
            {address ? "Account" : "Connect Wallet"}
          </ConnectWalletText>
        </ConnectWallet>
        <WalletDropdown>
          <Identity
            className="px-4 pt-3 pb-2"
            hasCopyAddressOnClick
            address={address || undefined}
            schemaId={schemaId}
          >
            <Avatar className="h-10 w-10" />
            <Name />
            <Address className="text-gray-500 text-xs" />
            <EthBalance />
            {username && (
              <div className="flex items-center mt-1">
                <Badge tooltip="Farcaster" className="mr-1" />
                <span className="text-xs text-gray-600">@{username}</span>
              </div>
            )}
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
