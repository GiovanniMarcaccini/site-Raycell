import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, productsByCategory } from "@/data/catalog";
import { CatalogShell } from "@/components/product/CatalogShell";
import { ProductGrid } from "@/components/product/ProductGrid";

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[categoria]">): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategory(categoria);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: PageProps<"/produtos/[categoria]">) {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) notFound();
  const items = productsByCategory(category.slug);

  return (
    <CatalogShell active={category.slug} title={category.name} intro={`${category.headline} ${category.description}`}>
      {items.length ? (
        <ProductGrid items={items} />
      ) : (
        <p className="py-20 text-center text-muted">Nenhum produto cadastrado nesta categoria ainda.</p>
      )}
    </CatalogShell>
  );
}
