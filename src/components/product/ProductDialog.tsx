"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { formatPrice, getCategory, products } from "@/data/catalog";
import { productInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { useBag } from "../bag/BagProvider";
import { ProductVisual } from "./ProductVisual";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";

export function ProductDialog() {
  const { detailsId, showDetails, add } = useBag();
  const product = products.find((p) => p.id === detailsId);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && showDetails(null);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      prev?.focus?.();
    };
  }, [showDetails]);

  if (!product) return null;
  const category = getCategory(product.category);
  const wa = whatsappLink(productInquiryMessage(product.name));

  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center sm:p-6">
      <div
        onClick={() => showDetails(null)}
        className={`absolute inset-0 bg-black/30 backdrop-blur-[3px] transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        tabIndex={-1}
        className={`relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] bg-white outline-none transition-all duration-500 ease-premium sm:grid-cols-2 sm:rounded-[2rem] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="relative aspect-square bg-surface sm:aspect-auto sm:min-h-[28rem]">
          <ProductVisual product={product} sizes="(min-width: 640px) 448px, 100vw" />
        </div>
        <div className="flex flex-col p-7 sm:p-10">
          <button
            onClick={() => showDetails(null)}
            aria-label="Fechar"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/80 backdrop-blur hover:bg-surface"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
          <p className="eyebrow">{category?.name}</p>
          <h2 id="product-dialog-title" className="display mt-3 text-3xl sm:text-4xl">
            {product.name}
          </h2>
          <p className="mt-3 text-ink-2">{product.summary}</p>
          <p className="mt-5 text-lg font-medium">{formatPrice(product.price)}</p>

          <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-sm text-ink-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-metal-3" strokeWidth={2} />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 pt-8">
            <button
              onClick={() => {
                add(product.id);
                showDetails(null);
              }}
              className="h-12 w-full rounded-full bg-ink text-sm font-medium text-white transition hover:bg-black"
            >
              Adicionar à sacola
            </button>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line-strong text-sm font-medium transition hover:border-ink"
              >
                <WhatsAppIcon className="size-4" /> Consultar pelo WhatsApp
              </a>
            )}
            {category && (
              <Link
                href={`/produtos/${category.slug}`}
                onClick={() => showDetails(null)}
                className="block text-center text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Ver todos em {category.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
