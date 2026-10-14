import { siteConfig } from "@/config/site";

/**
 * Assinatura do desenvolvedor: comentário no topo do documento (visível no
 * DevTools → Elements) e bloco estilizado no console.
 *
 * Usado no root layout via <Script strategy="beforeInteractive">. O comentário
 * é inserido antes de <html>, fora da árvore do React, para não interferir
 * na hidratação.
 */

const VERSION = "v2026.1";
const AUTHOR = "Giovanni Marcaccini";
const ROLE = "Front-end & Web Design";
const YEAR = "2026";

const STACK: [string, string][] = [
  ["Arquitetura", "Next.js 16 · React 19 · TypeScript"],
  ["Animações", "GSAP · ScrollTrigger · Canvas"],
  ["UI Kit", "Tailwind CSS 4 · Lucide Icons"],
  ["Base", "Geist Sans · Sequência WebP"],
];

const CONSOLE_STACK = "Next.js 16 · React 19 · TypeScript · GSAP · Tailwind CSS 4";

const label =(k: string) => k.padEnd(12);

const lines = [
  "",
  `${siteConfig.name} — ${siteConfig.tagline.replace(/\.$/, "")} · ${VERSION}`,
  "",
  ...STACK.map(([k, v]) => `${label(k)}: ${v}`),
  "",
  `Desenvolvido por : ${AUTHOR}`,
  ROLE,
  "",
  `© ${YEAR} ${siteConfig.name}. Todos os direitos reservados.`,
  "",
];

const width = Math.max(...lines.map((l) => l.length)) + 2;
const box = [
  `╔${"═".repeat(width)}╗`,
  ...lines.map((l) => `║ ${l.padEnd(width - 1)}║`),
  `╚${"═".repeat(width)}╝`,
].join("\n");

const comment = `\n\n${box}\n\n`;

export const signatureScript = `(function () {
  try { document.insertBefore(document.createComment(${JSON.stringify(comment)}), document.documentElement); } catch (e) {}
  var line = "color:#6b6b72;font-size:12px;padding:4px 0;border-top:1px solid #3a3a3f";
  console.log("%c" + ${JSON.stringify(siteConfig.name)}, "font:700 24px/1.4 system-ui,sans-serif;letter-spacing:-0.5px");
  console.log("%c" + ${JSON.stringify(`Desenvolvido por ${AUTHOR} · ${ROLE}`)}, "font-weight:600;font-size:12px;padding:4px 0;border-top:1px solid #3a3a3f");
  console.log("%c" + ${JSON.stringify(CONSOLE_STACK)}, line);
  console.log("%c" + ${JSON.stringify(`© ${YEAR} ${siteConfig.name}. Todos os direitos reservados.`)}, line);
})();`;
