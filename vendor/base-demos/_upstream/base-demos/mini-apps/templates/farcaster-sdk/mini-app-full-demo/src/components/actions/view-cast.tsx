"use client";

import { useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "~/components/ui/button";

export function ViewCastAction() {
  const [castHash, setCastHash] = useState<string>("0xfb2e255124ddb549a53fb4b1afdf4fa9f3542f78");

  const handleViewCast = useCallback((): void => {
    sdk.actions.viewCast({ hash: castHash, close: false });
  }, [castHash]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.actions.viewCast</pre>
      </div>
      <div className="mb-2">
        <input
          type="text"
          value={castHash}
          onChange={(e) => setCastHash(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 text-emerald-500 dark:text-emerald-400"
          placeholder="Enter cast hash to open"
        />
      </div>
      <Button onClick={handleViewCast}>View Cast</Button>
    </div>
  );
} 