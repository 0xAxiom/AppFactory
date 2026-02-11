import { CdpClient } from "@coinbase/cdp-sdk";
import "dotenv/config";
import crypto from "crypto";

// @ts-ignore
if (!global.crypto) global.crypto = crypto;

// Create a singleton instance of the CDP client
const cdpClient = new CdpClient({
  apiKeyId: process.env.CDP_API_KEY_ID,
  apiKeySecret: process.env.CDP_API_KEY_SECRET,
  walletSecret: process.env.CDP_WALLET_SECRET,
});

// Export the singleton instance
export const cdp = cdpClient;

// Export the client type for type safety
export type CDPClient = typeof cdpClient;
