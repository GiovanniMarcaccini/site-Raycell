"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/animations/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
  /** Atraso entre itens [data-reveal] */
  stagger?: number;
  y?: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

/**
 * Animações complementares de seção (separadas da estrutura visual):
 * - [data-reveal]        → fade + deslocamento vertical ao entrar na viewport
 * - [data-parallax="n"]  → parallax discreto (n = intensidade em %)
 * - [data-zoom]          → imagem desacelera de escala 1.08 → 1
 * Sem JS ou com reduced-motion o conteúdo aparece normalmente.
 */
export function Reveal({ children, className, id, as: Tag = "div", stagger = 0.08, y = 28, ...aria }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
        if (items.length) {
          gsap.set(items, { autoAlpha: 0, y });
          ScrollTrigger.batch(items, {
            start: "top 90%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger, ease: "power3.out", overwrite: true }),
          });
        }

        gsap.utils.toArray<HTMLElement>("[data-parallax]", root).forEach((el) => {
          const amount = Number(el.dataset.parallax || 8);
          gsap.fromTo(
            el,
            { yPercent: amount },
            {
              yPercent: -amount,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-zoom]", root).forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} {...aria}>
      {children}
    </Tag>
  );
}
