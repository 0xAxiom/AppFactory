"use client";

import dynamic from "next/dynamic";

import Provider from '../components/providers/WagmiProvider';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider>
    <MiniKitProvider
      enabled={true}
      notificationProxyUrl="/api/notify"
      autoConnect={true}
    >
    
        {children}
    </MiniKitProvider>
    </Provider>
  );
}