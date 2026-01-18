"use client";

import { useCallback, useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "~/components/ui/button";

export function AddMiniAppAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleMiniAppAdded = () => {
      setStatus("Mini App added successfully!");
      setError(null);
    };

    const handleMiniAppRemoved = () => {
      setStatus("Mini App was removed");
      setError(null);
    };

    sdk.on('miniAppAdded', handleMiniAppAdded);
    sdk.on('miniAppRemoved', handleMiniAppRemoved);

    return () => {
      sdk.removeListener('miniAppAdded', handleMiniAppAdded);
      sdk.removeListener('miniAppRemoved', handleMiniAppRemoved);
    };
  }, []);

  const addMiniApp = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setStatus(null);
    
    try {
      await sdk.actions.addMiniApp();
    } catch (err) {
      setError(`Failed to add Mini App: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.actions.addMiniApp</pre>
      </div>
      
      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg my-2 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      
      {status && (
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg my-2 text-xs text-green-600 dark:text-green-400">
          {status}
        </div>
      )}
      
      <Button 
        onClick={addMiniApp}
        disabled={loading}
        isLoading={loading}
      >
        Add Mini App
      </Button>
    </div>
  );
}
