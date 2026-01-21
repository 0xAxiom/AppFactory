"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);

      // Initial check
      setMatches(media.matches);

      // Add listener for changes
      const listener = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };

      // Add the listener
      media.addEventListener("change", listener);

      // Clean up
      return () => {
        media.removeEventListener("change", listener);
      };
    }

    // Default to false on server-side
    return () => {};
  }, [query]);

  return matches;
}
