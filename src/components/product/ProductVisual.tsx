"use client";

import Image from "next/image";
import { useId } from "react";
import type { ProductVisualKind } from "@/data/catalog";

type Props = {
  product: { name: string; image?: string; visual?: ProductVisualKind };
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Imagem do produto. Enquanto não houver fotos reais do catálogo, categorias
 * sem imagem usam ilustrações vetoriais neutras (genéricas, não são fotos
 * oficiais). Basta preencher `image` no catálogo para substituí-las.
 */
export function ProductVisual({ product, sizes = "(min-width: 1024px) 25vw, 50vw", priority, className = "" }: Props) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`absolute inset-0 grid place-items-center ${className}`} role="img" aria-label={`${product.name} — ilustração`}>
      <Illustration kind={product.visual ?? "case"} />
    </div>
  );
}

function Illustration({ kind }: { kind: ProductVisualKind }) {
  const uid = useId().replace(/:/g, "");
  const metal = `metal-${uid}`;
  const glass = `glass-${uid}`;
  const shadow = `shadow-${uid}`;

  const defs = (
    <defs>
      <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f7f7f8" />
        <stop offset="0.45" stopColor="#d5d7db" />
        <stop offset="0.7" stopColor="#eef0f2" />
        <stop offset="1" stopColor="#a9adb3" />
      </linearGradient>
      <linearGradient id={glass} x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#2a2c31" />
        <stop offset="0.55" stopColor="#141518" />
        <stop offset="1" stopColor="#30333a" />
      </linearGradient>
      <radialGradient id={shadow} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#000" stopOpacity="0.18" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  const common = "h-[64%] w-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.12)]";

  switch (kind) {
    case "watch":
      return (
        <svg viewBox="0 0 200 260" className={common} aria-hidden>
          {defs}
          <ellipse cx="100" cy="246" rx="60" ry="8" fill={`url(#${shadow})`} />
          <rect x="62" y="6" width="76" height="70" rx="18" fill="#d9dbdf" />
          <rect x="62" y="184" width="76" height="70" rx="18" fill="#d9dbdf" />
          <rect x="40" y="58" width="120" height="144" rx="34" fill={`url(#${metal})`} />
          <rect x="49" y="67" width="102" height="126" rx="27" fill={`url(#${glass})`} />
          <rect x="161" y="104" width="9" height="26" rx="4" fill="#bfc2c7" />
          <rect x="162" y="140" width="5" height="18" rx="2.5" fill="#c9ccd1" />
          <text x="100" y="128" textAnchor="middle" fill="#f5f5f7" fontSize="26" fontWeight="600" fontFamily="system-ui">10:09</text>
          <circle cx="100" cy="150" r="3" fill="#8d9198" />
        </svg>
      );
    case "airpods":
      return (
        <svg viewBox="0 0 220 220" className={common} aria-hidden>
          {defs}
          <ellipse cx="110" cy="204" rx="80" ry="8" fill={`url(#${shadow})`} />
          <rect x="34" y="70" width="152" height="128" rx="46" fill={`url(#${metal})`} />
          <path d="M34 116h152" stroke="#b9bcc1" strokeWidth="1.5" />
          <rect x="102" y="150" width="16" height="4" rx="2" fill="#a9adb3" />
          <circle cx="110" cy="134" r="3" fill="#8f9399" />
          <g transform="translate(70 18) rotate(-12)">
            <ellipse cx="0" cy="12" rx="18" ry="20" fill="#f6f6f7" stroke="#d7d9dd" />
            <rect x="-6" y="18" width="12" height="44" rx="6" fill="#f2f3f4" stroke="#d7d9dd" />
          </g>
          <g transform="translate(150 18) rotate(12)">
            <ellipse cx="0" cy="12" rx="18" ry="20" fill="#f6f6f7" stroke="#d7d9dd" />
            <rect x="-6" y="18" width="12" height="44" rx="6" fill="#f2f3f4" stroke="#d7d9dd" />
          </g>
        </svg>
      );
    case "charger":
      return (
        <svg viewBox="0 0 220 220" className={common} aria-hidden>
          {defs}
          <ellipse cx="110" cy="206" rx="78" ry="7" fill={`url(#${shadow})`} />
          <rect x="58" y="62" width="104" height="104" rx="22" fill={`url(#${metal})`} />
          <rect x="98" y="104" width="24" height="10" rx="5" fill="#2a2c31" />
          <rect x="84" y="34" width="8" height="30" rx="3" fill="#bfc2c7" />
          <rect x="128" y="34" width="8" height="30" rx="3" fill="#bfc2c7" />
          <path d="M110 166c0 20-10 26-30 26s-40 4-44 14" fill="none" stroke="#e7e8ea" strokeWidth="9" strokeLinecap="round" />
          <path d="M110 166c0 20-10 26-30 26s-40 4-44 14" fill="none" stroke="#cfd2d6" strokeWidth="1" />
        </svg>
      );
    case "case":
    default:
      return (
        <svg viewBox="0 0 200 260" className={common} aria-hidden>
          {defs}
          <ellipse cx="100" cy="248" rx="62" ry="7" fill={`url(#${shadow})`} />
          <rect x="44" y="10" width="112" height="228" rx="26" fill="#2b2d31" />
          <rect x="50" y="16" width="100" height="216" rx="21" fill="#3a3d43" />
          <rect x="60" y="26" width="46" height="46" rx="14" fill="#1d1e21" stroke="#55585f" />
          <circle cx="76" cy="42" r="8" fill="#0f1012" stroke="#60636a" />
          <circle cx="92" cy="58" r="8" fill="#0f1012" stroke="#60636a" />
          <rect x="120" y="60" width="62" height="140" rx="18" transform="rotate(8 151 130)" fill={`url(#${metal})`} opacity="0.92" />
        </svg>
      );
  }
}
