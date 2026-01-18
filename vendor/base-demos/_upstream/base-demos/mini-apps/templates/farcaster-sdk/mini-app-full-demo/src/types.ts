import React from "react";

export type TabType = "actions" | "context" | "wallet";
export type ActionPageType = "list" | "signin" | "quickauth" | "openurl" | "openminiapp" | "farcaster" | "viewprofile" | "viewtoken" | "swaptoken" | "sendtoken" | "viewcast" | "composecast" | "addminiapp" | "closeminiapp" | "runtime" | "requestcameramicrophone" | "haptics" | "spendpermission";
export type WalletPageType = "list" | "basepay" | "wallet";

export interface ActionDefinition {
  id: ActionPageType;
  name: string;
  description: string;
  component: React.ComponentType;
  icon: React.ComponentType<Record<string, unknown>>;
}

export interface WalletActionDefinition {
  id: WalletPageType;
  name: string;
  description: string;
  component: React.ComponentType;
  icon: React.ComponentType<Record<string, unknown>>;
}
