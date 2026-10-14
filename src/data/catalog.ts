/**
 * Catálogo de DEMONSTRAÇÃO.
 *
 * Nenhum preço, estoque ou promoção foi inventado: `price` é `null`
 * ("Preço sob consulta") e todos os itens têm `demo: true`, exibido no card.
 * Substitua por dados reais (CMS, planilha, API) mantendo o mesmo formato.
 */

export type CategorySlug = "iphone" | "apple-watch" | "airpods" | "acessorios";

export type ProductVisualKind = "watch" | "airpods" | "charger" | "case";

export type Category = {
  slug: CategorySlug;
  name: string;
  headline: string;
  description: string;
  image?: string;
  visual?: ProductVisualKind;
};

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  summary: string;
  highlights: string[];
  /** Em centavos (BRL). `null` = preço sob consulta. */
  price: number | null;
  image?: string;
  visual?: ProductVisualKind;
  demo: boolean;
  featured?: boolean;
};

export const categories: Category[] = [
  {
    slug: "iphone",
    name: "iPhone",
    headline: "Do clássico ao mais recente.",
    description: "Modelos selecionados, com procedência e atendimento próximo.",
    image: "/images/category-iphone.webp",
  },
  {
    slug: "apple-watch",
    name: "Apple Watch",
    headline: "Tempo, saúde e estilo no pulso.",
    description: "Relógios para acompanhar cada movimento do seu dia.",
    visual: "watch",
  },
  {
    slug: "airpods",
    name: "AirPods",
    headline: "Som que acompanha você.",
    description: "Áudio sem fios para música, chamadas e foco.",
    visual: "airpods",
  },
  {
    slug: "acessorios",
    name: "Acessórios",
    headline: "Os detalhes que completam.",
    description: "Carregadores, cabos, capas e proteção para o dia a dia.",
    visual: "charger",
  },
];

const DEMO_NOTE = "Item de demonstração — dados reais a definir";

export const products: Product[] = [
  {
    id: "iphone-linha-pro",
    name: "iPhone — Linha Pro",
    category: "iphone",
    summary: "Câmeras avançadas e acabamento premium.",
    highlights: ["Capacidades e cores sob consulta", "Condição (novo/seminovo) a confirmar", DEMO_NOTE],
    price: null,
    image: "/images/iphone-f140.webp",
    demo: true,
    featured: true,
  },
  {
    id: "iphone-linha-padrao",
    name: "iPhone — Linha padrão",
    category: "iphone",
    summary: "O equilíbrio ideal para o dia a dia.",
    highlights: ["Capacidades e cores sob consulta", "Condição (novo/seminovo) a confirmar", DEMO_NOTE],
    price: null,
    image: "/images/iphone-f100.webp",
    demo: true,
    featured: true,
  },
  {
    id: "iphone-classicos",
    name: "iPhone — Gerações anteriores",
    category: "iphone",
    summary: "Modelos anteriores com ótimo custo-benefício.",
    highlights: ["Disponibilidade sob consulta", DEMO_NOTE],
    price: null,
    image: "/images/iphone-f60.webp",
    demo: true,
  },
  {
    id: "apple-watch",
    name: "Apple Watch",
    category: "apple-watch",
    summary: "Saúde, treinos e notificações no pulso.",
    highlights: ["Tamanhos e pulseiras sob consulta", DEMO_NOTE],
    price: null,
    visual: "watch",
    demo: true,
    featured: true,
  },
  {
    id: "airpods",
    name: "AirPods",
    category: "airpods",
    summary: "Conexão instantânea com seu iPhone.",
    highlights: ["Gerações disponíveis sob consulta", DEMO_NOTE],
    price: null,
    visual: "airpods",
    demo: true,
    featured: true,
  },
  {
    id: "carregadores-cabos",
    name: "Carregadores e cabos",
    category: "acessorios",
    summary: "Energia confiável para todos os seus dispositivos.",
    highlights: ["Modelos e potências sob consulta", DEMO_NOTE],
    price: null,
    visual: "charger",
    demo: true,
  },
  {
    id: "capas-peliculas",
    name: "Capas e películas",
    category: "acessorios",
    summary: "Proteção sem abrir mão do design.",
    highlights: ["Compatibilidade por modelo sob consulta", DEMO_NOTE],
    price: null,
    visual: "case",
    demo: true,
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsByCategory = (slug: CategorySlug) => products.filter((p) => p.category === slug);
export const featuredProducts = () => products.filter((p) => p.featured);

export function formatPrice(cents: number | null) {
  if (cents === null) return "Preço sob consulta";
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
