"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { mainNav } from "@/config/site";
import { useBag } from "../bag/BagProvider";
import { Logo } from "./Logo";

/**
 * Header minimalista:
 * - transparente sobre o palco do vídeo, vidro fosco depois dele;
 * - recolhe ao rolar para baixo e volta ao rolar para cima.
 * Scroll ouvido de forma passiva e processado 1x por frame (rAF).
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { count, open, notice } = useBag();
  const [solid, setSolid] = useState(!isHome);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const stage = document.getElementById("evolucao");
      const stageEnd = stage ? stage.offsetTop + stage.offsetHeight - window.innerHeight : 0;
      const overStage = Boolean(stage) && y < stageEnd + window.innerHeight * 0.5;
      setSolid(!overStage && y > 8);
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 120);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const href = (h: string) => (isHome ? h : `/${h}`);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[transform,background-color,border-color,backdrop-filter] duration-500 ease-premium",
          solid ? "border-b border-black/[0.06] bg-white/75 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent",
          // volta a aparecer quando algo é adicionado à sacola
          hidden && !menuOpen && !notice ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo onClick={() => setMenuOpen(false)} />

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={href(item.href)}
                    className="relative text-[0.8rem] font-medium text-ink-2 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 hover:text-ink hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={open}
              aria-label={`Abrir sacola (${count} ${count === 1 ? "item" : "itens"})`}
              className="relative grid size-10 place-items-center rounded-full transition hover:bg-black/5"
            >
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-ink px-1 text-[0.6rem] font-semibold leading-4 text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="grid size-10 place-items-center rounded-full transition hover:bg-black/5 md:hidden"
            >
              {menuOpen ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-opacity duration-500 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Menu móvel" className="flex h-full flex-col justify-center px-8">
          <ul className="space-y-2">
            {mainNav.map((item, i) => (
              <li
                key={item.href}
                className="transition-all duration-700 ease-premium"
                style={{
                  transitionDelay: menuOpen ? `${80 + i * 50}ms` : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "none" : "translateY(16px)",
                }}
              >
                <Link
                  href={href(item.href)}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                  className="display block py-1 text-[2.4rem]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="metal-rule mt-10" />
          <Link
            href="/produtos"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
            className="mt-6 text-sm font-medium text-ink-2"
          >
            Ver todos os produtos →
          </Link>
        </nav>
      </div>
    </>
  );
}
