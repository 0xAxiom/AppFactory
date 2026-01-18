"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { requestSpendPermission } from "@base-org/account/spend-permission";
import { createBaseAccountSDK } from "@base-org/account";
import { base } from "viem/chains";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAccount, useChainId } from "wagmi";

const DEFAULT_SPENDER = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik
const DEFAULT_TOKEN = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC

export function RequestSpendPermissionAction() {
  const sdk = useMemo(() => createBaseAccountSDK({
    appName: "Base Account SDK Demo",
    appLogoUrl: "https://base.org/logo.png",
    appChainIds: [base.id],
  }), []);

  const { address, isConnected } = useAccount();
  const connectedChainId = useChainId();

  const [account, setAccount] = useState<string>(address ?? "");
  const [spender, setSpender] = useState(DEFAULT_SPENDER);
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [chainId, setChainId] = useState<string>(String(connectedChainId || base.id));
  const [allowance, setAllowance] = useState<string>("1000000"); // 1 USDC with 6 decimals
  const [periodInDays, setPeriodInDays] = useState<string>("30");

  const [permission, setPermission] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setAccount(address);
    }
  }, [address]);

  useEffect(() => {
    if (connectedChainId) {
      setChainId(String(connectedChainId));
    }
  }, [connectedChainId]);

  const handleRequest = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPermission(null);

    try {
      const parsedChainId = Number(chainId) || base.id;
      const parsedAllowance = allowance ? BigInt(allowance) : 0n;
      const parsedPeriod = Number(periodInDays) || 0;

      const permissionResponse = await requestSpendPermission({
        account,
        spender,
        token,
        chainId: parsedChainId,
        allowance: parsedAllowance,
        periodInDays: parsedPeriod,
        provider: sdk.getProvider(),
      });

      setPermission(JSON.stringify(permissionResponse, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to request spend permission";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [account, allowance, chainId, periodInDays, sdk, spender, token]);

  return (
    <div className="mb-4 space-y-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">
          requestSpendPermission
        </pre>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="spend-account" className="text-xs font-semibold text-gray-500">
            Base Account (owner)
          </Label>
          <Input
            id="spend-account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="0x..."
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="spend-spender" className="text-xs font-semibold text-gray-500">
            Spender address
          </Label>
          <Input
            id="spend-spender"
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
            placeholder="0x..."
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="spend-token" className="text-xs font-semibold text-gray-500">
            Token (ERC-20 or native wrapper)
          </Label>
          <Input
            id="spend-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="0x..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="spend-chain" className="text-xs font-semibold text-gray-500">
              Chain ID
            </Label>
            <Input
              id="spend-chain"
              type="number"
              value={chainId}
              onChange={(e) => setChainId(e.target.value)}
              placeholder="8453"
              inputMode="numeric"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="spend-period" className="text-xs font-semibold text-gray-500">
              Period (days)
            </Label>
            <Input
              id="spend-period"
              type="number"
              value={periodInDays}
              onChange={(e) => setPeriodInDays(e.target.value)}
              placeholder="30"
              inputMode="numeric"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="spend-allowance" className="text-xs font-semibold text-gray-500">
            Allowance (raw token units)
          </Label>
          <Input
            id="spend-allowance"
            type="text"
            value={allowance}
            onChange={(e) => setAllowance(e.target.value)}
            placeholder="1000000"
            inputMode="numeric"
          />
          <p className="text-[11px] text-muted-foreground">
            Example: 1 USDC = 1,000,000 (6 decimals)
          </p>
        </div>
      </div>

      {permission && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="font-semibold text-xs text-gray-500 dark:text-gray-400 mb-1">Permission</div>
          <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400 whitespace-pre-wrap break-all">
            {permission}
          </pre>
        </div>
      )}

      {error && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="font-semibold text-xs text-gray-500 dark:text-gray-400 mb-1">Error</div>
          <pre className="font-mono text-xs text-red-500 dark:text-red-400 whitespace-pre-wrap break-all">
            {error}
          </pre>
        </div>
      )}

      <Button onClick={handleRequest} disabled={!isConnected || loading || !account}>
        {loading ? "Requesting..." : isConnected ? "Request Spend Permission" : "Connect wallet to continue"}
      </Button>

      <p className="text-[11px] text-muted-foreground">
        Requests an EIP-712 spend permission signature the app can register on-chain later.
      </p>
    </div>
  );
}

