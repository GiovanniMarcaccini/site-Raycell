/**
 * Páginas institucionais. O conteúdo jurídico/comercial deve ser fornecido
 * pela Raycell Imports — nada aqui foi inventado.
 */
export const policies = {
  privacidade: { title: "Política de privacidade" },
  "trocas-e-devolucoes": { title: "Trocas e devoluções" },
  garantia: { title: "Garantia" },
  "termos-de-uso": { title: "Termos de uso" },
} as const;

export type PolicySlug = keyof typeof policies;
