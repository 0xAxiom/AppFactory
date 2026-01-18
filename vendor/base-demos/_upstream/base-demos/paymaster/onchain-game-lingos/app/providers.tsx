'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
        },
        paymaster: process.env.NEXT_PUBLIC_PAYMASTER_PROXY_SERVER_URL,
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}
