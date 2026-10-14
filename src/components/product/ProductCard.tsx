"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import type { Product } from "@/data/catalog";
import { formatPrice } from "@/data/catalog";
import { productInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { useBag } from "../bag/BagProvider";
import { ProductVisual } from "./ProductVisual";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { add, showDetails } = useBag();
  const wa = whatsappLink(productInquiryMessage(product.name));

  return (
    <article data-reveal className="group relative flex flex-col">
      <button
        type="button"
        onClick={() => showDetails(product.id)}
        aria-label={`Ver detalhes de ${product.name}`}
        className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-surface text-left"
      >
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-premium group-hover:scale-[1.04]">
          <ProductVisual product={product} priority={priority} />
        </div>
        {/* brilho metálico no hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.45)_50%,transparent_65%)] transition-transform duration-[1.4s] ease-premium group-hover:translate-x-full"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/80 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-ink-2 backdrop-blur">
          {product.demo ? "Demonstração" : "Disponível"}
        </span>
        <span className="absolute bottom-4 right-4 grid size-10 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 shadow-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" strokeWidth={1.75} />
        </span>
      </button>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <h3 className="text-[1.05rem] font-semibold tracking-tight">{product.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{product.summary}</p>
        <p className="mt-3 text-sm font-medium text-ink-2">{formatPrice(product.price)}</p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => showDetails(product.id)}
            className="h-10 flex-1 rounded-full border border-line-strong px-4 text-sm font-medium transition hover:border-ink"
          >
            Ver detalhes
          </button>
          <button
            type="button"
            onClick={() => add(product.id)}
            aria-label={`Adicionar ${product.name} à sacola`}
            className="grid size-10 place-items-center rounded-full bg-ink text-white transition hover:bg-black active:scale-95"
          >
            <Plus className="size-4" strokeWidth={2} />
          </button>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar ${product.name} pelo WhatsApp`}
              className="grid size-10 place-items-center rounded-full border border-line-strong transition hover:border-ink"
            >
              <WhatsAppIcon className="size-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
