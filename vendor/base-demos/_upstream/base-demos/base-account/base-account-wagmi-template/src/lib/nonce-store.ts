import { kv } from '@vercel/kv';

// In-memory fallback for local development
const inMemoryStore = new Map<string, { nonce: string; timestamp: number }>();

// Cleanup old nonces from in-memory store (older than 5 minutes)
const NONCE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function cleanupInMemoryStore() {
  const now = Date.now();
  const entries = Array.from(inMemoryStore.entries());
  for (let i = 0; i < entries.length; i++) {
    const [address, data] = entries[i];
    if (now - data.timestamp > NONCE_EXPIRY_MS) {
      inMemoryStore.delete(address);
    }
  }
}

/**
 * Check if Vercel KV is available
 */
function isKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Generate a random nonce
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Store a nonce for an address
 * Uses Vercel KV if available, otherwise falls back to in-memory storage
 */
export async function storeNonce(address: string, nonce: string): Promise<void> {
  if (isKVAvailable()) {
    // Store in Redis with 5 minute expiration
    await kv.set(`nonce:${address.toLowerCase()}`, nonce, { ex: 300 });
  } else {
    // Fallback to in-memory store
    cleanupInMemoryStore();
    inMemoryStore.set(address.toLowerCase(), {
      nonce,
      timestamp: Date.now(),
    });
  }
}

/**
 * Get a nonce for an address
 * Uses Vercel KV if available, otherwise falls back to in-memory storage
 */
export async function getNonce(address: string): Promise<string | null> {
  if (isKVAvailable()) {
    // Get from Redis
    const nonce = await kv.get<string>(`nonce:${address.toLowerCase()}`);
    return nonce;
  } else {
    // Fallback to in-memory store
    cleanupInMemoryStore();
    const data = inMemoryStore.get(address.toLowerCase());
    if (data && Date.now() - data.timestamp < NONCE_EXPIRY_MS) {
      return data.nonce;
    }
    return null;
  }
}

/**
 * Delete a nonce for an address (after successful verification)
 * Uses Vercel KV if available, otherwise falls back to in-memory storage
 */
export async function deleteNonce(address: string): Promise<void> {
  if (isKVAvailable()) {
    // Delete from Redis
    await kv.del(`nonce:${address.toLowerCase()}`);
  } else {
    // Delete from in-memory store
    inMemoryStore.delete(address.toLowerCase());
  }
}

