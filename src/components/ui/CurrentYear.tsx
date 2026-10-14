"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Ano atual resolvido no cliente — fora do shell pré-renderizado. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year}</span>;
}
