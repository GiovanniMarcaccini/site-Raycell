import { ScrollEvolution } from "@/components/evolution/ScrollEvolution";
import { BrandReveal } from "@/components/home/BrandReveal";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { AboutRaycell } from "@/components/home/AboutRaycell";
import { ContactSection } from "@/components/home/ContactSection";

/**
 * Entrada → primeiro iPhone → gerações → modernos → dobrável conceitual
 * → Raycell Imports → categorias → destaques → sobre → contato
 */
export default function HomePage() {
  return (
    <>
      <ScrollEvolution />
      <BrandReveal />
      <Categories />
      <FeaturedProducts />
      <AboutRaycell />
      <ContactSection />
    </>
  );
}
