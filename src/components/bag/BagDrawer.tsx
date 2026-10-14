"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useBag } from "./BagProvider";
import { ProductVisual } from "../product/ProductVisual";
import { formatPrice } from "@/data/catalog";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";

export function BagDrawer() {
  const { lines, count, isOpen, close, setQty, remove, clear } = useBag();
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Monta → anima entrada no próximo frame
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(isOpen));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      prev?.focus?.();
    };
  }, [isOpen, close]);

  const message = [
    "Olá, Raycell Imports! Gostaria de consultar disponibilidade e valores destes itens:",
    ...lines.map((l) => `• ${l.qty}x ${l.product.name}`),
  ].join("\n");
  const checkout = whatsappLink(message);

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sacola"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-[0_0_80px_-20px_rgba(0,0,0,0.35)] outline-none transition-transform duration-500 ease-premium ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold tracking-tight">
            Sacola <span className="font-normal text-muted">({count})</span>
          </h2>
          <button onClick={close} aria-label="Fechar sacola" className="grid size-10 place-items-center rounded-full hover:bg-surface">
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <ShoppingBag className="size-8 text-metal-3" strokeWidth={1.25} />
            <p className="font-medium">Sua sacola está vazia.</p>
            <p className="text-sm text-muted">Adicione produtos para consultar disponibilidade e valores com a equipe.</p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-4 py-5">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <ProductVisual product={l.product} sizes="80px" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate font-medium">{l.product.name}</p>
                  <p className="text-sm text-muted">{formatPrice(l.product.price)}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border border-line">
                      <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Diminuir quantidade" className="grid size-8 place-items-center">
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Aumentar quantidade" className="grid size-8 place-items-center">
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button onClick={() => remove(l.id)} aria-label={`Remover ${l.product.name}`} className="text-muted hover:text-ink">
                      <Trash2 className="size-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 && (
          <footer className="space-y-3 border-t border-line px-6 py-5">
            <p className="text-xs leading-relaxed text-muted">
              Valores e disponibilidade são confirmados pela equipe Raycell no atendimento.
            </p>
            {checkout ? (
              <a
                href={checkout}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition hover:bg-black"
              >
                <WhatsAppIcon className="size-4" />
                Consultar pelo WhatsApp
              </a>
            ) : (
              <p className="rounded-xl bg-surface px-4 py-3 text-center text-sm text-muted">
                Atendimento por WhatsApp em configuração.
              </p>
            )}
            <button onClick={clear} className="w-full text-center text-xs text-muted underline-offset-4 hover:underline">
              Esvaziar sacola
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
