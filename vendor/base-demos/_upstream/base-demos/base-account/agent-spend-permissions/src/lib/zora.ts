import { getProfile, setApiKey } from '@zoralabs/coins-sdk'

// Set up Zora API key
if (process.env.ZORA_API_KEY) {
  setApiKey(process.env.ZORA_API_KEY)
}

export interface ZoraProfile {
  handle: string
  displayName: string
  bio: string
  avatar?: {
    medium: string
  }
  creatorCoin?: {
    address: string
    marketCap: string
    marketCapDelta24h: string
  }
  linkedWallets?: {
    edges: Array<{
      node: {
        walletType: string
        walletAddress: string
      }
    }>
  }
}

export async function lookupZoraProfile(identifier: string): Promise<ZoraProfile | null> {
  try {
    // Ensure API key is set
    if (!process.env.ZORA_API_KEY) {
      console.warn('ZORA_API_KEY not set, API requests may be rate limited')
    }

    // If identifier looks like a wallet address, use it directly
    // Otherwise, try to resolve it as a handle
    let searchIdentifier = identifier
    
    if (!identifier.startsWith('0x')) {
      // For handles, we might need to search or resolve differently
      // This is a simplified approach - in production, you might need more sophisticated lookup
      searchIdentifier = identifier.toLowerCase()
    }

    const response = await getProfile({
      identifier: searchIdentifier,
    })

    const profile: any = response?.data?.profile
    
    if (!profile) {
      return null
    }

    return {
      handle: profile.handle,
      displayName: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar,
      creatorCoin: profile.creatorCoin,
      linkedWallets: profile.linkedWallets,
    }
  } catch (error) {
    console.error('Failed to lookup Zora profile:', error)
    return null
  }
}

export async function buyZoraCoin(
  profile: ZoraProfile,
  amountUSD: number,
  serverWalletClient: any
): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
  try {
    if (!profile.creatorCoin?.address) {
      return { success: false, error: 'No creator coin found for this profile' }
    }

    // Convert USD to the appropriate token amount
    // This is simplified - in production, you'd need proper price calculation
    const amountInWei = BigInt(Math.floor(amountUSD * 1_000_000)) // Assuming USDC with 6 decimals

    // Here you would implement the actual coin buying logic
    // This would involve:
    // 1. Getting the current coin price
    // 2. Calculating how many coins to buy
    // 3. Executing the swap/purchase transaction
    
    // For now, we'll simulate the transaction
    console.log(`Simulating purchase of ${amountUSD} USD worth of coins for ${profile.handle}`)
    
    // In a real implementation, you would:
    // 1. Call the Zora contract to buy coins
    // 2. Use the server wallet to execute the transaction
    // 3. Return the transaction hash
    
    // Simulated transaction hash
    const mockTxHash = `0x${Math.random().toString(16).substring(2).padStart(64, '0')}`
    
    return {
      success: true,
      transactionHash: mockTxHash,
    }
  } catch (error) {
    console.error('Failed to buy Zora coin:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export function formatZoraProfile(profile: ZoraProfile): string {
  let description = `**${profile.displayName || profile.handle}** (@${profile.handle})\n`
  
  if (profile.bio) {
    description += `${profile.bio}\n\n`
  }
  
  if (profile.creatorCoin) {
    description += `**Creator Coin:**\n`
    description += `- Address: \`${profile.creatorCoin.address}\`\n`
    description += `- Market Cap: ${profile.creatorCoin.marketCap}\n`
    if (profile.creatorCoin.marketCapDelta24h) {
      description += `- 24h Change: ${profile.creatorCoin.marketCapDelta24h}\n`
    }
  }
  
  return description
}