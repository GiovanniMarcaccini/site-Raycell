import Link from "next/link";
import { featuredProducts } from "@/data/catalog";
import { Reveal } from "../ui/Reveal";
import { ProductCard } from "../product/ProductCard";

export function FeaturedProducts() {
  const items = featuredProducts();
  return (
    <Reveal as="section" id="produtos" aria-labelledby="produtos-title" className="bg-white pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="metal-rule mb-20" />
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p data-reveal className="eyebrow">
              Produtos em destaque
            </p>
            <h2 data-reveal id="produtos-title" className="display mt-4 max-w-2xl text-[clamp(2.2rem,4.6vw,4rem)]">
              Selecionados para você.
            </h2>
          </div>
          <p data-reveal className="max-w-sm text-sm leading-relaxed text-muted">
            Catálogo em demonstração. Preços, condições e disponibilidade são confirmados diretamente com a equipe Raycell.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div data-reveal className="mt-16 flex justify-center">
          <Link
            href="/produtos"
            className="inline-flex h-12 items-center rounded-full border border-line-strong px-7 text-sm font-medium transition hover:border-ink"
          >
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
