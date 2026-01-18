import {
  requestSpendPermission,
  prepareSpendCallData,
  fetchPermissions,
  getPermissionStatus,
  requestRevoke,
} from '@base-org/account/spend-permission'
import { createBaseAccountSDK } from '@base-org/account'

export interface SpendPermission {
  account: string
  spender: string
  token: string
  chainId: number
  allowance: bigint
  periodInDays: number
  signature?: string
}

export const USDC_BASE_ADDRESS = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'

export async function requestUserSpendPermission(
  userAccount: string,
  spenderAccount: string,
  dailyLimitUSD: number = 2
): Promise<SpendPermission> {
  try {
    // Convert USD to USDC (6 decimals)
    const allowanceUSDC = BigInt(dailyLimitUSD * 1_000_000)

    const permission = await requestSpendPermission({
      account: userAccount as `0x${string}`,
      spender: spenderAccount as `0x${string}`,
      token: USDC_BASE_ADDRESS as `0x${string}`,
      chainId: 8453, // Base mainnet
      allowance: allowanceUSDC,
      periodInDays: 1, // Daily limit
      provider: createBaseAccountSDK({
        appName: "Zora Creator Coins Agent",
      }).getProvider(),
    })

    return {
      account: userAccount,
      spender: spenderAccount,
      token: USDC_BASE_ADDRESS,
      chainId: 8453,
      allowance: allowanceUSDC,
      periodInDays: 1,
      ...permission
    }
  } catch (error) {
    console.error('Failed to request spend permission:', error)
    throw new Error('Failed to request spend permission')
  }
}

export async function getUserSpendPermissions(
  userAccount: string,
  spenderAccount: string
) {
  try {
    console.log('🔧 Creating Base Account SDK...')
    const sdk = createBaseAccountSDK({
      appName: "Zora Creator Coins Agent",
    })
    const provider = sdk.getProvider()
    console.log('✅ SDK and provider created')

    console.log('📡 Calling fetchPermissions with:')
    console.log('  - account:', userAccount)
    console.log('  - chainId: 8453')
    console.log('  - spender:', spenderAccount)
    console.log('  - USDC_BASE_ADDRESS:', USDC_BASE_ADDRESS)

    const permissions = await fetchPermissions({
      account: userAccount as `0x${string}`,
      chainId: 8453,
      spender: spenderAccount as `0x${string}`,
      provider,
    })

    console.log('📋 Raw fetchPermissions result:', permissions)
    console.log('📊 Total permissions returned:', permissions.length)

    // Log each permission before filtering
    if (permissions.length > 0) {
      permissions.forEach((permission, index) => {
        const tokenAddress = permission.permission?.token?.toLowerCase()
        const usdcAddress = USDC_BASE_ADDRESS.toLowerCase()
        console.log(`🔍 Permission ${index + 1} before filtering:`, {
          token: permission.permission?.token,
          tokenLowercase: tokenAddress,
          usdcLowercase: usdcAddress,
          isUSDC: tokenAddress === usdcAddress,
          allowance: permission.permission?.allowance?.toString(),
          account: permission.permission?.account,
          spender: permission.permission?.spender,
        })
      })
    }

    const filteredPermissions = permissions.filter(p => 
      p.permission?.token?.toLowerCase() === USDC_BASE_ADDRESS.toLowerCase()
    )
    console.log('✅ Filtered USDC permissions:', filteredPermissions.length)

    return filteredPermissions
  } catch (error) {
    console.error('❌ Failed to fetch spend permissions:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return []
  }
}

export async function checkSpendPermissionStatus(permission: any) {
  try {
    const status = await getPermissionStatus(permission)
    return status
  } catch (error) {
    console.error('Failed to check permission status:', error)
    return { isActive: false, remainingSpend: BigInt(0) }
  }
}

export async function prepareSpendTransaction(
  permission: any,
  amountUSD: number
) {
  try {
    // Convert USD to USDC (6 decimals)
    const amountUSDC = BigInt(Math.floor(amountUSD * 1_000_000))

    const spendCalls = await prepareSpendCallData(permission, amountUSDC)

    return spendCalls
  } catch (error) {
    console.error('Failed to prepare spend transaction:', error)
    throw new Error('Failed to prepare spend transaction')
  }
}

export async function revokeSpendPermission(permission: any): Promise<string> {
  try {
    console.log('🔄 Revoking spend permission:', permission)
    
    // Ensure the permission object has the correct structure for requestRevoke
    const normalizedPermission = {
      permission: permission,
      provider: createBaseAccountSDK({
        appName: "Zora Creator Coins Agent",
      }).getProvider(),
    }
    
    console.log('🔧 Normalized permission for revoke:', normalizedPermission)
    
    // Use requestRevoke for user-initiated revoke (shows wallet popup)
    const result = await requestRevoke(normalizedPermission)
    
    console.log('✅ Spend permission revoked successfully, result:', result)
    console.log('🔍 Result type:', typeof result)
    console.log('🔍 Result structure:', result)
    
    // requestRevoke returns an object with an 'id' property containing the transaction hash
    const hash: string = (result as any).id
    
    console.log('✅ Final hash:', hash)
    return hash
  } catch (error) {
    console.error('❌ Failed to revoke spend permission:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      permission: permission
    })
    throw new Error(`Failed to revoke spend permission: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}