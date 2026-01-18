// lib/utils/validateWallet.ts

export function validateWallet(address: string): boolean {
    if (!address) return false
    const trimmed = address.trim()
    return /^0x[a-fA-F0-9]{40}$/.test(trimmed)
  }
  
/**
 * Validates a Zora handle
 * 
 * @param handle The handle to validate
 * @returns True if the handle is valid, false otherwise
 */
export function validateHandle(handle: string): boolean {
  // Remove @ if present and trim whitespace
  const cleanHandle = handle.trim().replace(/^@/, '')
  
  // Check if handle is not empty and doesn't contain invalid characters
  return cleanHandle.length > 0 && /^[a-zA-Z0-9._-]+$/.test(cleanHandle)
}
  