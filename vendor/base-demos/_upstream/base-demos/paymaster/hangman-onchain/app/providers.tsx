'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';
import { PAYMASTER_URL } from './utils/constants';
export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{ appearance: { mode: 'auto' }, paymaster: PAYMASTER_URL }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}
