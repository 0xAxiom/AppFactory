"use client";

import { useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { useClose } from "@coinbase/onchainkit/minikit";

export function CloseMiniAppAction() {
  // Call the hook at component level
  const close = useClose();

  const handleClose = useCallback((): void => {
    close();
  }, [close]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">useClose()</pre>
      </div>
      <Button onClick={handleClose}>Close Mini App</Button>
    </div>
  );
} 