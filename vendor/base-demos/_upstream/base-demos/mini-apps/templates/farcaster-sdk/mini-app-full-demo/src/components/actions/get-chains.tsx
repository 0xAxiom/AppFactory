"use client";

import { useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "~/components/ui/button";

export function GetChainsAction() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<unknown>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleGetChains = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(undefined);
      setResult(undefined);
      
      const chains = await sdk.getChains();
      setResult(chains);
    } catch (err) {
      console.error("Get chains error:", err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.getChains</pre>
      </div>
      <Button onClick={handleGetChains} disabled={loading}>
        Get Chains
      </Button>
      {error && !loading && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 dark:bg-gray-800 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1">Error</div>
          <div className="whitespace-pre text-red-500 dark:text-red-400">{error}</div>
        </div>
      )}
      {result !== undefined && !loading && (
        <div className="my-2">
          <div className="p-2 text-xs overflow-x-scroll bg-gray-100 dark:bg-gray-800 rounded-lg font-mono">
            <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1">Chains Result</div>
            <div className="whitespace-pre text-emerald-500 dark:text-emerald-400">{JSON.stringify(result, null, 2)}</div>
          </div>
        </div>
      )}
    </div>
  );
} 