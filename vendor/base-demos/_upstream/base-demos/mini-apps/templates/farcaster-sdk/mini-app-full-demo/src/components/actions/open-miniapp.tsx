"use client";

import { useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "~/components/ui/button";

const MINIAPP_OPTIONS = [
  {
    name: "Coop Records", 
    url: "https://cooprecords.xyz"
  },
  {
    name: "Eggs", 
    url: "https://farcaster.xyz/miniapps/Qqjy9efZ-1Qu/eggs"
  },
  {
    name: "Dylan Steck",
    url: "https://farcaster.xyz/miniapps/n-4cZfiZxIQv/dylan-steck",
  },
  {
    name: "Mini App Demo",
    url: "https://miniapp-starter.val.run"
  },
  {
    name: "Invalid URL",
    url: "https://invalid-miniapp-example.com"
  }
];

export function OpenMiniAppAction() {
  const [selectedOption, setSelectedOption] = useState(MINIAPP_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenMiniApp = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await sdk.actions.openMiniApp({
        url: selectedOption.url
      });
      // If successful, this app will close, so we won't reach this point
    } catch (err) {
      setError(`Failed to open Mini App: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [selectedOption.url]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.actions.openMiniApp</pre>
      </div>
      
      <div className="mb-2">
        <select
          value={JSON.stringify(selectedOption)}
          onChange={(e) => setSelectedOption(JSON.parse(e.target.value))}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 text-emerald-500 dark:text-emerald-400"
        >
          {MINIAPP_OPTIONS.map((option) => (
            <option key={option.url} value={JSON.stringify(option)}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        URL: {selectedOption.url}
      </div>
      
      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg my-2 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      
      <Button 
        onClick={handleOpenMiniApp}
        disabled={loading}
        isLoading={loading}
      >
        Open Mini App
      </Button>
    </div>
  );
} 