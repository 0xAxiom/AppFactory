"use client";

import { useState, useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useViewProfile, useMiniKit } from "@coinbase/onchainkit/minikit";

export function ViewProfileAction() {
  const [fid, setFid] = useState<string>('3');
  
  // Use MiniKit's useViewProfile hook and get context for current user
  const viewProfile = useViewProfile();
  const { context } = useMiniKit();

  const handleViewProfile = useCallback((): void => {
    const fidNumber = parseInt(fid);
    viewProfile(fidNumber);
  }, [viewProfile, fid]);
  
  const handleViewMyProfile = useCallback((): void => {
    // When called without arguments, uses current user's FID from context
    viewProfile();
  }, [viewProfile]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">useViewProfile()</pre>
      </div>
      
      {context?.user?.fid && (
        <div className="p-2 bg-muted border border-border rounded-lg my-2">
          <div className="font-mono text-xs text-primary">Current user FID: {context.user.fid}</div>
        </div>
      )}
      
      <div className="space-y-2">
        <div>
          <Label className="text-xs font-semibold text-gray-500 mb-1" htmlFor="view-profile-fid">
            Enter FID to view profile
          </Label>
          <Input
            id="view-profile-fid"
            type="number"
            value={fid}
            className="mb-2 text-emerald-500 dark:text-emerald-400"
            onChange={(e) => setFid(e.target.value)}
            step="1"
            min="1"
            placeholder="Enter FID number"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleViewProfile} className="flex-1">
            View Profile (FID {fid})
          </Button>
          {context?.user?.fid && (
            <Button onClick={handleViewMyProfile} className="flex-1">
              View My Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 