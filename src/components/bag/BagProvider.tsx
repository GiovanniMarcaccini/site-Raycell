"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { products, type Product } from "@/data/catalog";

type BagLine = { id: string; qty: number };

type BagContextValue = {
  lines: (BagLine & { product: Product })[];
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** Produto aberto no diálogo de detalhes */
  detailsId: string | null;
  showDetails: (id: string | null) => void;
  /** Última mensagem de feedback (toast) */
  notice: string | null;
};

const BagContext = createContext<BagContextValue | null>(null);
const STORAGE_KEY = "raycell:bag:v1";

// Carregados sob demanda (code splitting)
const BagDrawer = dynamic(() => import("./BagDrawer").then((m) => m.BagDrawer), { ssr: false });
const ProductDialog = dynamic(() => import("../product/ProductDialog").then((m) => m.ProductDialog), { ssr: false });

export function BagProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [everOpened, setEverOpened] = useState(false);

  // Restaura a sacola (preferência local do visitante)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as BagLine[]) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do armazenamento local após montar
      setLines(parsed.filter((l) => products.some((p) => p.id === l.id) && l.qty > 0));
    } catch {
      /* armazenamento indisponível: sacola só em memória */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 2400);
    return () => window.clearTimeout(t);
  }, [notice]);

  const add = useCallback((id: string) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      return found ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { id, qty: 1 }];
    });
    const name = products.find((p) => p.id === id)?.name;
    setNotice(name ? `${name} adicionado à sacola` : "Adicionado à sacola");
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const remove = useCallback((id: string) => setLines((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => {
    setEverOpened(true);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const showDetails = useCallback((id: string | null) => setDetailsId(id), []);

  const value = useMemo<BagContextValue>(() => {
    const resolved = lines
      .map((l) => ({ ...l, product: products.find((p) => p.id === l.id)! }))
      .filter((l) => Boolean(l.product));
    return {
      lines: resolved,
      count: resolved.reduce((n, l) => n + l.qty, 0),
      isOpen,
      open,
      close,
      add,
      setQty,
      remove,
      clear,
      detailsId,
      showDetails,
      notice,
    };
  }, [lines, isOpen, open, close, add, setQty, remove, clear, detailsId, showDetails, notice]);

  return (
    <BagContext.Provider value={value}>
      {children}
      {(everOpened || isOpen) && <BagDrawer />}
      {detailsId && <ProductDialog />}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4 transition-all duration-500 ${
          notice ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        {notice && (
          <span className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)]">
            {notice}
          </span>
        )}
      </div>
    </BagContext.Provider>
  );
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag deve ser usado dentro de <BagProvider>");
  return ctx;
}
