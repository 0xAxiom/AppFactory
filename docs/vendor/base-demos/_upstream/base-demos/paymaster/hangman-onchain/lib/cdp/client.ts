import { CdpClient } from '@coinbase/cdp-sdk';
import 'dotenv/config';
import crypto from 'crypto';

// @ts-expect-error: Node.js global.crypto may not exist, polyfill for CDP SDK
if (!global.crypto) global.crypto = crypto;

const cdpClient = new CdpClient({
  apiKeyId: process.env.CDP_API_KEY_ID,
  apiKeySecret: process.env.CDP_API_KEY_SECRET,
  walletSecret: process.env.CDP_WALLET_SECRET,
});

export const cdp = cdpClient;
export type CDPClient = typeof cdpClient;
