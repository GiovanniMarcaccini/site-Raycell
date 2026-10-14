import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/catalog";
import { Reveal } from "../ui/Reveal";
import { ProductVisual } from "../product/ProductVisual";

export function Categories() {
  const [hero, ...rest] = categories;
  return (
    <Reveal as="section" id="categorias" aria-labelledby="categorias-title" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p data-reveal className="eyebrow">
              Categorias
            </p>
            <h2 data-reveal id="categorias-title" className="display mt-4 max-w-xl text-[clamp(2.2rem,4.6vw,4rem)]">
              Escolha por onde começar.
            </h2>
          </div>
          <Link data-reveal href="/produtos" className="text-sm font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline">
            Ver todos os produtos →
          </Link>
        </div>

        <div className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-2">
          {/* Destaque editorial */}
          <Link
            data-reveal
            href={`/produtos/${hero.slug}`}
            className="group relative flex min-h-[26rem] overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#e4e5e7] to-[#d2d3d5] lg:min-h-[46rem]"
          >
            <div
              data-zoom
              className="absolute inset-x-0 bottom-0 top-[26%] [mask-image:linear-gradient(180deg,transparent,#000_22%)]"
            >
              <Image
                src={hero.image!}
                alt="iPhone em estúdio claro"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-[1.6s] ease-premium group-hover:scale-[1.03]"
              />
            </div>
            <CategoryText name={hero.name} headline={hero.headline} />
          </Link>

          <div className="grid gap-4 sm:gap-5 lg:grid-rows-3">
          {rest.map((c) => (
            <Link
              data-reveal
              key={c.slug}
              href={`/produtos/${c.slug}`}
              className="group relative flex min-h-[15rem] overflow-hidden rounded-[2rem] bg-surface lg:min-h-0"
            >
              <div className="absolute inset-y-0 right-0 w-[55%] transition-transform duration-[1.2s] ease-premium group-hover:scale-105">
                <ProductVisual product={{ name: c.name, visual: c.visual }} />
              </div>
              <CategoryText name={c.name} headline={c.headline} compact />
            </Link>
          ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function CategoryText({ name, headline, compact }: { name: string; headline: string; compact?: boolean }) {
  return (
    <div className={`relative z-10 flex w-full flex-col justify-between p-7 sm:p-9 ${compact ? "max-w-[60%]" : ""}`}>
      <div>
        <p className="text-sm font-medium text-ink-2">{name}</p>
        <h3 className={`display mt-2 ${compact ? "text-2xl sm:text-[1.75rem]" : "text-[clamp(1.9rem,3.2vw,2.75rem)]"}`}>{headline}</h3>
      </div>
      <span className="mt-6 inline-flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-sm transition-transform duration-500 group-hover:rotate-45">
        <ArrowUpRight className="size-4" strokeWidth={1.75} />
      </span>
    </div>
  );
}
