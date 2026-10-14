"use client";

import { useSyncExternalStore } from "react";

/**
 * Media query segura para SSR: no servidor (e na hidratação) retorna
 * `serverValue`, evitando mismatch; depois acompanha a mudança real.
 */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  return useMediaQuery(REDUCED_MOTION_QUERY, false);
}
