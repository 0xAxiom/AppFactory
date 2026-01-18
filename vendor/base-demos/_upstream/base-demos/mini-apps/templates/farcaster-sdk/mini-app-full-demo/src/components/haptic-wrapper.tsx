"use client";

import { ReactNode } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

interface HapticWrapperProps {
  children: ReactNode;
  onClick?: () => void;
  hapticType?: "impact" | "selection";
  className?: string;
}

export function HapticWrapper({ 
  children, 
  onClick, 
  hapticType = "impact",
  className 
}: HapticWrapperProps) {
  const handleClick = async () => {
    try {
      if (hapticType === "selection") {
        await sdk.haptics.selectionChanged();
      } else {
        await sdk.haptics.impactOccurred('light');
      }
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}
