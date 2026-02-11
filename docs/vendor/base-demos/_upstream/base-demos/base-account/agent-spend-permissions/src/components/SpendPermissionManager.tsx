'use client';

import React, { useState, useEffect } from 'react';
import {
  getUserSpendPermissions,
  revokeSpendPermission,
} from '@/lib/spend-permissions';

interface SpendPermissionManagerProps {
  isAuthenticated: boolean;
  userAddress?: string;
}

export function SpendPermissionManager({
  isAuthenticated,
  userAddress,
}: SpendPermissionManagerProps) {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [isRevoking, setIsRevoking] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  useEffect(() => {
    if (isAuthenticated && userAddress) {
      loadPermissions();
    }
  }, [isAuthenticated, userAddress]);

  const loadPermissions = async () => {
    if (!userAddress) {
      console.log('❌ No userAddress provided to loadPermissions');
      return;
    }

    console.log('🔍 Starting to load permissions for user:', userAddress);
    setIsLoadingPermissions(true);
    try {
      // Get server wallet address
      console.log('📡 Fetching server wallet address...');
      const walletResponse = await fetch('/api/wallet/create', {
        method: 'POST',
      });

      console.log('📡 Wallet API response status:', walletResponse.status);
      if (!walletResponse.ok) {
        throw new Error(
          `Failed to get server wallet: ${walletResponse.status}`
        );
      }

      const walletData = await walletResponse.json();
      console.log('💰 Server wallet data:', walletData);

      const spenderAddress = walletData.smartAccountAddress;
      console.log('🏦 Spender address (server wallet):', spenderAddress);

      if (!spenderAddress) {
        throw new Error('Server wallet address not found in response');
      }

      // Get user's spend permissions
      console.log('🔍 Fetching permissions with:');
      console.log('  - User account:', userAddress);
      console.log('  - Spender account:', spenderAddress);
      console.log('  - Chain ID: 8453 (Base mainnet)');

      const userPermissions = await getUserSpendPermissions(
        userAddress,
        spenderAddress
      );

      console.log('✅ Raw permissions fetched:', userPermissions);
      console.log('📊 Number of permissions found:', userPermissions.length);

      if (userPermissions.length > 0) {
        userPermissions.forEach((permission, index) => {
          console.log(`📋 Permission ${index + 1}:`, {
            permissionHash: permission.permissionHash,
            signature: permission.signature
              ? `${permission.signature.slice(0, 10)}...`
              : 'No signature',
            chainId: permission.chainId,
            permission: {
              account: permission.permission?.account,
              spender: permission.permission?.spender,
              token: permission.permission?.token,
              allowance: permission.permission?.allowance?.toString(),
              period: permission.permission?.period,
              start: permission.permission?.start,
              end: permission.permission?.end,
            },
          });
        });
      } else {
        console.log(
          '⚠️ No permissions found for this user/spender combination'
        );
      }

      setPermissions(userPermissions);
    } catch (error) {
      console.error('❌ Error loading permissions:', error);
      setPermissionError(
        `Failed to load spend permissions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleRevokePermission = async (permission: any) => {
    setIsRevoking(true);
    setPermissionError('');

    try {
      const hash = await revokeSpendPermission(permission);
      console.log('Permission revoked successfully:', hash);

      // Reload permissions
      await loadPermissions();
    } catch (error) {
      console.error('Revoke error:', error);
      setPermissionError(
        error instanceof Error ? error.message : 'Failed to revoke permission'
      );
    } finally {
      setIsRevoking(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-sm">Sign in to manage your spend permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Spend Permissions
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage your active spend permissions
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingPermissions ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">
              Loading permissions...
            </span>
          </div>
        ) : permissions.length > 0 ? (
          <div className="space-y-3">
            {permissions.map((permission, index) => (
              <div
                key={index}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      $
                      {(
                        Number(
                          permission.permission?.allowance ||
                            permission.allowance ||
                            0
                        ) / 1_000_000
                      ).toFixed(2)}{' '}
                      USDC
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Daily limit • Active</div>
                      <div className="font-mono text-xs bg-white px-2 py-1 rounded border">
                        {permission.permissionHash
                          ? `${permission.permissionHash.slice(0, 10)}...`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokePermission(permission)}
                    disabled={isRevoking}
                    className="ml-3 px-3 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-md border border-red-200 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isRevoking ? 'Revoking...' : 'Revoke'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              No active spend permissions
            </p>
            <p className="text-xs text-gray-500">
              Set up permissions in the previous step to start using the agent
            </p>
          </div>
        )}

        {permissionError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {permissionError}
          </div>
        )}
      </div>

      {/* Footer */}
      {permissions.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            💡 Revoked permissions will be removed immediately
          </div>
        </div>
      )}
    </div>
  );
}
