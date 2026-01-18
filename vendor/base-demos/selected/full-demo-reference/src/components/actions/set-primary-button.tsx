"use client";

import { useCallback, useState } from "react";
import { Button } from "~/components/ui/Button";
import { usePrimaryButton } from "@coinbase/onchainkit/minikit";

export function SetPrimaryButtonAction() {
  const [isButtonSet, setIsButtonSet] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Callback for when primary button is clicked
  const handlePrimaryButtonClick = useCallback(() => {
    setClickCount(prev => prev + 1);
  }, []);

  // Use MiniKit's usePrimaryButton hook when button is enabled
  usePrimaryButton(
    isButtonSet ? {
      text: "New label set!!",
      loading: false,
      disabled: false,
      hidden: false,
    } : {
      text: "",
      loading: false,
      disabled: true,
      hidden: true,
    },
    handlePrimaryButtonClick
  );

  const togglePrimaryButton = useCallback((): void => {
    setIsButtonSet(prev => !prev);
    if (!isButtonSet) {
      setClickCount(0); // Reset count when enabling
    }
  }, [isButtonSet]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">usePrimaryButton()</pre>
      </div>
      
      {isButtonSet && clickCount > 0 && (
        <div className="p-2 bg-muted border border-border rounded-lg my-2">
          <div className="font-mono text-xs text-primary">Primary button clicked {clickCount} time{clickCount !== 1 ? 's' : ''}!</div>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Status: Primary button is {isButtonSet ? 'enabled' : 'disabled'}
        </div>
        <Button onClick={togglePrimaryButton}>
          {isButtonSet ? 'Hide Primary Button' : 'Set Primary Button'}
        </Button>
      </div>
    </div>
  );
} 