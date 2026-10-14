import type { Metadata } from "next";
import { products } from "@/data/catalog";
import { CatalogShell } from "@/components/product/CatalogShell";
import { ProductGrid } from "@/components/product/ProductGrid";

export const metadata: Metadata = {
  title: "Produtos",
  description: "iPhones, Apple Watch, AirPods e acessórios na Raycell Imports.",
};

export default function ProductsPage() {
  return (
    <CatalogShell title="Produtos" intro="iPhones, Apple Watch, AirPods e acessórios — tudo em um só lugar.">
      <ProductGrid items={products} />
    </CatalogShell>
  );
}
