// 👾 MiniKitProvider is the magic sauce that turns a regular Next.js app into a Farcaster Mini App.
// ✅ It wires in the Frames SDK context (user, client, launch location, etc.)
// ✅ Sets up wagmi + react-query under the hood so you don’t have to
// ✅ Applies client-safe insets to avoid overlap with Warpcast UI
// ✅ Handles theming and app appearance for Coinbase Wallet and beyond
"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
