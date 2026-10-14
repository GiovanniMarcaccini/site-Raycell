import { siteConfig } from "@/config/site";

export const isWhatsAppConfigured = siteConfig.whatsappNumber.length >= 10;

/** Retorna o link wa.me ou `null` se o número ainda não foi configurado. */
export function whatsappLink(message: string = siteConfig.whatsappDefaultMessage): string | null {
  if (!isWhatsAppConfigured) return null;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productInquiryMessage(productName: string) {
  return `Olá, Raycell Imports! Tenho interesse no produto: ${productName}. Poderia me passar disponibilidade e valores?`;
}
