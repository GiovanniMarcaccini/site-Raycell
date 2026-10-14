import Link from "next/link";
import type { ReactNode } from "react";
import { categories } from "@/data/catalog";

/** Cabeçalho + filtro de categorias das páginas de listagem. */
export function CatalogShell({ active, title, intro, children }: { active?: string; title: string; intro: string; children: ReactNode }) {
  const tabs = [{ slug: "", name: "Todos" }, ...categories];
  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 pt-[calc(var(--header-h)+4rem)] sm:px-8">
      <nav aria-label="Trilha" className="text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Início
        </Link>
        <span className="mx-2">/</span>
        <Link href="/produtos" className="hover:text-ink">
          Produtos
        </Link>
        {active && (
          <>
            <span className="mx-2">/</span>
            <span className="text-ink-2">{title}</span>
          </>
        )}
      </nav>
      <h1 className="display mt-6 text-[clamp(2.6rem,6vw,5rem)]">{title}</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-2">{intro}</p>

      <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {tabs.map((t) => {
          const isActive = (active ?? "") === t.slug;
          return (
            <Link
              key={t.slug || "todos"}
              href={t.slug ? `/produtos/${t.slug}` : "/produtos"}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-ink text-white" : "border border-line-strong text-ink-2 hover:border-ink hover:text-ink"
              }`}
            >
              {t.name}
            </Link>
          );
        })}
      </div>

      <p className="mt-8 rounded-2xl bg-surface px-5 py-4 text-sm text-muted">
        Catálogo de demonstração: preços, estoque e condições serão publicados quando o catálogo oficial estiver disponível.
      </p>

      <div className="mt-12">{children}</div>
    </section>
  );
}
