import type { Metadata } from "next";
import { ScrollEvolution } from "@/components/evolution/ScrollEvolution";
import { BrandReveal } from "@/components/home/BrandReveal";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { AboutRaycell } from "@/components/home/AboutRaycell";
import { ContactSection } from "@/components/home/ContactSection";
import { V2 } from "@/lib/sequence-v2";

/** Página de teste: a mesma home com o vídeo v2 na abertura. */
export const metadata: Metadata = {
  title: "Index 2.0 (teste)",
  robots: { index: false, follow: false },
};

export default function Index2Page() {
  return (
    <>
      <ScrollEvolution variant={V2} />
      <BrandReveal />
      <Categories />
      <FeaturedProducts />
      <AboutRaycell />
      <ContactSection />
    </>
  );
}
