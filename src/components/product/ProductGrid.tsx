import type { Product } from "@/data/catalog";
import { Reveal } from "../ui/Reveal";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <Reveal className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 2} />
      ))}
    </Reveal>
  );
}
