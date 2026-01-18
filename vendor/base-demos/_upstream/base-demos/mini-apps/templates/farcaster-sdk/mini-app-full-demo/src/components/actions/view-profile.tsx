"use client";

import { useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export function ViewProfileAction() {
  const [fid, setFid] = useState<string>('3');

  const handleViewProfile = useCallback((): void => {
    sdk.actions.viewProfile({ fid: parseInt(fid) });
  }, [fid]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.actions.viewProfile</pre>
      </div>
      <div>
        <Label className="text-xs font-semibold text-gray-500 mb-1" htmlFor="view-profile-fid">Fid</Label>
        <Input
          id="view-profile-fid"
          type="number"
          value={fid}
          className="mb-2 text-emerald-500 dark:text-emerald-400"
          onChange={(e) => setFid(e.target.value)}
          step="1"
          min="1"
        />
      </div>
      <Button onClick={handleViewProfile}>
        View Profile
      </Button>
    </div>
  );
} 