/**
 * Configuração central da marca.
 *
 * Dados de contato NÃO são inventados: preencha via variáveis de ambiente
 * (.env.local) — veja .env.example. Campos vazios simplesmente não aparecem
 * no site (ou exibem um aviso discreto de "a configurar").
 */
export const siteConfig = {
  name: "Raycell Imports",
  shortName: "Raycell",
  tagline: "Exclusividade em cada detalhe.",
  description:
    "Raycell Imports — iPhones, Apple Watch, AirPods e acessórios. Uma nova forma de viver a inovação.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  instagram: {
    handle: "@raycell_imports",
    url: "https://www.instagram.com/raycell_imports/",
  },

  /** Somente dígitos, com DDI + DDD. Ex.: 5511999999999 */
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  whatsappDefaultMessage: "Olá, Raycell Imports! Gostaria de mais informações.",

  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  /** Endereço / cidade, se a loja quiser divulgar */
  location: process.env.NEXT_PUBLIC_STORE_LOCATION || "",
  /** Horário de atendimento */
  hours: process.env.NEXT_PUBLIC_STORE_HOURS || "",
  /** Razão social / CNPJ para o rodapé */
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || "",
  cnpj: process.env.NEXT_PUBLIC_CNPJ || "",
} as const;

export type NavItem = { label: string; href: string };

/** Âncoras da home. Em outras páginas o Header prefixa com "/". */
export const mainNav: NavItem[] = [
  { label: "Evolução", href: "#evolucao" },
  { label: "Categorias", href: "#categorias" },
  { label: "Produtos", href: "#produtos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export const policyLinks: NavItem[] = [
  { label: "Política de privacidade", href: "/politicas/privacidade" },
  { label: "Trocas e devoluções", href: "/politicas/trocas-e-devolucoes" },
  { label: "Garantia", href: "/politicas/garantia" },
  { label: "Termos de uso", href: "/politicas/termos-de-uso" },
];
