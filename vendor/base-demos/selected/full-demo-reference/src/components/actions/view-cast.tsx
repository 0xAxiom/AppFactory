"use client";

import { useState, useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { useViewCast } from "@coinbase/onchainkit/minikit";

export function ViewCastAction() {
  const [castHash, setCastHash] = useState<string>("0xfb2e255124ddb549a53fb4b1afdf4fa9f3542f78");
  const [close, setClose] = useState<boolean>(false);
  
  // Use MiniKit's useViewCast hook (React Query powered)
  const { viewCast, isPending, error, data } = useViewCast();

  const handleViewCast = useCallback((): void => {
    viewCast({ hash: castHash, close });
  }, [viewCast, castHash, close]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">useViewCast()</pre>
      </div>
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cast Hash
          </label>
          <input
            type="text"
            value={castHash}
            onChange={(e) => setCastHash(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 text-emerald-500 dark:text-emerald-400"
            placeholder="Enter cast hash to open"
            disabled={isPending}
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="close-app-viewcast"
            checked={close}
            onChange={(e) => setClose(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isPending}
          />
          <label htmlFor="close-app-viewcast" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Close app after viewing cast
          </label>
        </div>
      </div>
      
      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg my-2 text-xs text-red-600 dark:text-red-400">
          Error: {error.message}
        </div>
      )}
      
      {!!data && (
        <div className="p-2 bg-muted border border-border rounded-lg my-2">
          <div className="font-mono text-xs text-primary">Cast opened successfully!</div>
        </div>
      )}
      
      <Button 
        onClick={handleViewCast}
        disabled={isPending || !castHash.trim()}
        isLoading={isPending}
      >
        {isPending ? "Opening Cast..." : "View Cast"}
      </Button>
    </div>
  );
} 