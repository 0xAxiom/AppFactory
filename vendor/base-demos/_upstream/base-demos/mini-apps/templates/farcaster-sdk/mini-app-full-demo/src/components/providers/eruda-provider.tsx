"use client";

import { useEffect } from "react";

export default function ErudaProvider() {
  useEffect(() => {
    import("eruda").then((eruda) => {
      if (!window.eruda) {
        window.eruda = eruda.default;
        const erudaInstance = eruda.default as {
          init: (config?: { 
            defaults?: { 
              displaySize?: number; 
              transparency?: number;
            };
            tool?: string[];
          }) => void;
          position: (config: { x: number; y: number }) => void;
        };
        erudaInstance.init({
          defaults: {
            displaySize: 50,
            transparency: 0.8,
          },
        });
        
        setTimeout(() => {
          erudaInstance.position({ x: window.innerWidth - 60, y: window.innerHeight - 60 });
        }, 100);
        
        console.log("Eruda initialized for debugging");
      }
    });
  }, []);

  return null;
}

declare global {
  interface Window {
    eruda?: unknown;
  }
}
