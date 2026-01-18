import { CdpClient } from '@coinbase/cdp-sdk'
import { createWalletClient, http } from 'viem'
import { toAccount } from 'viem/accounts'
import { base } from 'viem/chains'

let cdpClient: CdpClient | null = null

export function getCdpClient(): CdpClient {
  if (!cdpClient) {
    cdpClient = new CdpClient()
  }
  return cdpClient
}

interface ServerWallet {
  address: string
  walletClient: any
  account: any
  smartAccount?: any
}

// Use a global variable to persist across hot reloads in development
declare global {
  var __serverWallets: Map<string, ServerWallet> | undefined
}

const serverWallets = globalThis.__serverWallets ?? new Map<string, ServerWallet>()
globalThis.__serverWallets = serverWallets

export async function createServerWalletForUser(userAddress: string): Promise<ServerWallet> {
  try {
    console.log('Creating/getting server wallet for user:', userAddress)
    console.log('Current server wallets count:', serverWallets.size)
    console.log('Server wallets keys:', Array.from(serverWallets.keys()))
    
    // Check if wallet already exists for this user
    if (serverWallets.has(userAddress) && serverWallets.get(userAddress)?.smartAccount) {
      console.log('Found existing server wallet for user:', userAddress)
      return serverWallets.get(userAddress)!
    }

    console.log('Creating new server wallet for user:', userAddress)
    const cdp = getCdpClient()
    
    // Create CDP account
    const account = await cdp.evm.createAccount()
    console.log('Created CDP account with address:', account.address)

    // Create viem wallet client
    const walletClient = createWalletClient({
      account: toAccount(account),
      chain: base,
      transport: http(),
    })

    // Create smart account for gas sponsorship
    const smartAccount = await cdp.evm.createSmartAccount({
      owner: account,
    })

    console.log('Smart account:', smartAccount)

    const serverWallet: ServerWallet = {
      address: account.address,
      walletClient,
      account,
      smartAccount
    }

    // Store wallet for this user session
    serverWallets.set(userAddress, serverWallet)
    console.log('Stored server wallet with smart account. New count:', serverWallets.size)

    // Note: Server wallet will use gas sponsorship via paymaster, no funding needed
    console.log('Server wallet created for Base mainnet with gas sponsorship')

    return serverWallet
  } catch (error) {
    console.error('Failed to create server wallet:', error)
    throw new Error('Failed to create server wallet')
  }
}

export function getServerWalletForUser(userAddress: string): ServerWallet | null {
  return serverWallets.get(userAddress) || null
}