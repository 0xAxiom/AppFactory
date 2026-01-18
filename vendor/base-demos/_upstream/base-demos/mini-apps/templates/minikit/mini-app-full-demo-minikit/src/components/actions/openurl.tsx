"use client";

import { useState, useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";

export function OpenUrlAction() {
  const [customUrl, setCustomUrl] = useState<string>("https://google.com");
  
  // Call the hook at component level
  const openUrl = useOpenUrl();

  const handleOpenUrl = useCallback((): void => {
    openUrl(customUrl);
  }, [openUrl, customUrl]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">useOpenUrl()</pre>
      </div>
      <div className="mb-2">
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 text-emerald-500 dark:text-emerald-400"
          placeholder="Enter URL to open"
        />
      </div>
      <Button onClick={handleOpenUrl}>Open Link</Button>
    </div>
  );
} 