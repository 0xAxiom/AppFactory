"use client";

import { useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "~/components/ui/button";

export function CloseMiniAppAction() {
  const close = useCallback((): void => {
    sdk.actions.close();
  }, []);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.actions.close</pre>
      </div>
      <Button onClick={close}>Close Mini App</Button>
    </div>
  );
} 