/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useFrameContext } from "~/components/providers/frame-provider";
import { sdk } from "@farcaster/miniapp-sdk";

export function TopBar() {
  const frameContext = useFrameContext();

  const handleProfileClick = () => {
    if (frameContext?.context && (frameContext.context as any)?.user?.fid) {
      sdk.actions.viewProfile({ fid: (frameContext.context as any).user.fid });
    }
  };

  const userPfp = frameContext?.context && (frameContext.context as any)?.user?.pfpUrl 
    ? (frameContext.context as any).user.pfpUrl 
    : undefined;

  return (
    <div className="mb-6 mt-3 flex items-center justify-between">
      <Image 
        src="/base-logo.png" 
        alt="Base" 
        width={120}
        height={32}
        className="h-8 object-contain"
      />
      
      {userPfp && (
        <button
          onClick={handleProfileClick}
          className="flex-shrink-0"
        >
          <Image
            src={userPfp as string}
            alt="Profile"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        </button>
      )}
    </div>
  );
}
