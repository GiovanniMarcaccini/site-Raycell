"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { gsap, useGSAP } from "@/animations/gsap";

/**
 * Momento 5 — continuação direta da "abertura de luz" do vídeo.
 * O palco termina em branco puro e esta seção começa no mesmo branco.
 */
export function BrandReveal() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
          defaults: { ease: "power4.out" },
        });
        tl.from("[data-word]", { yPercent: 110, duration: 1.3, stagger: 0.09 })
          .from("[data-rule]", { scaleX: 0, duration: 1.4, ease: "power3.inOut" }, 0.2)
          .from("[data-fade]", { autoAlpha: 0, y: 18, duration: 1, stagger: 0.1 }, 0.45);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="brand-title" className="relative overflow-hidden bg-white">
      <div className="mx-auto flex min-h-[86svh] max-w-6xl flex-col items-center justify-center px-6 py-28 text-center">
        <p data-fade className="eyebrow">
          Apresentamos
        </p>
        <h2 id="brand-title" className="display mt-6 text-[clamp(3rem,10vw,9rem)] leading-[0.95]">
          {["Raycell", "Imports."].map((w, i) => (
            <span key={w} className={`inline-block overflow-hidden px-[0.04em] pb-[0.08em] align-bottom ${i === 0 ? "mr-[0.22em]" : ""}`}>
              <span data-word className="inline-block">
                {w}
              </span>
            </span>
          ))}
        </h2>
        <div data-rule className="metal-rule mt-8 w-40 origin-center" />
        <p data-fade className="mt-8 text-[clamp(1.1rem,2vw,1.6rem)] text-ink-2">
          Exclusividade em cada detalhe.
        </p>
        <div data-fade className="mt-10">
          <Link
            href="#categorias"
            className="group inline-flex h-13 items-center gap-3 rounded-full bg-ink pl-7 pr-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Explore nossos produtos
            <span className="grid size-9 place-items-center rounded-full bg-white/10 transition-transform duration-500 group-hover:translate-y-0.5">
              <ArrowDown className="size-4" strokeWidth={1.75} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
