"use client";

import { useState, useEffect } from "react";

interface HashParamsOptions {
  /**
   * Whether to clear the hash after reading
   * @default true
   */
  clearAfterRead?: boolean;

  /**
   * Delay before clearing the hash in milliseconds
   * @default 100
   */
  clearDelay?: number;
}

/**
 * Custom hook to access URL hash parameters
 * @param options - Configuration options
 * @returns Hash parameters as key-value pairs
 */
export function useHashParams(
  options: HashParamsOptions = {},
): Record<string, string> {
  const { clearAfterRead = true, clearDelay = 100 } = options;

  const [hashParams, setHashParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const parseHash = (): void => {
      // Only run in browser environment
      if (typeof window === "undefined") return;

      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);

      const paramsObj: Record<string, string> = {};
      params.forEach((value, key) => {
        paramsObj[key] = value;
      });

      setHashParams(paramsObj);

      // Clear the hash if requested
      if (clearAfterRead && Object.keys(paramsObj).length > 0) {
        setTimeout(() => {
          window.history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search,
          );
        }, clearDelay);
      }
    };

    // Parse hash on initial load
    parseHash();

    // Listen for hash changes
    window.addEventListener("hashchange", parseHash);

    return () => {
      window.removeEventListener("hashchange", parseHash);
    };
  }, [clearAfterRead, clearDelay]);

  return hashParams;
}
