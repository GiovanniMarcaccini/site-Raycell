import Link from "next/link";
import { AtSign } from "lucide-react";
import { categories } from "@/data/catalog";
import { mainNav, policyLinks, siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { CurrentYear } from "../ui/CurrentYear";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{siteConfig.tagline} iPhones, Apple Watch, AirPods e acessórios.</p>
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-4 py-2 text-sm font-medium transition hover:border-ink"
            >
              <AtSign className="size-4" strokeWidth={1.75} />
              {siteConfig.instagram.handle.replace("@", "")}
            </a>
          </div>

          <FooterCol title="Navegação" links={mainNav.map((n) => ({ label: n.label, href: `/${n.href}` }))} />
          <FooterCol
            title="Produtos"
            links={[...categories.map((c) => ({ label: c.name, href: `/produtos/${c.slug}` })), { label: "Todos os produtos", href: "/produtos" }]}
          />
          <FooterCol title="Institucional" links={policyLinks} />
        </div>

        <div className="metal-rule mt-14" />
        <div className="mt-6 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.legalName || siteConfig.name}
            {siteConfig.cnpj && ` · CNPJ ${siteConfig.cnpj}`}. Todos os direitos reservados.
          </p>
          <p className="max-w-xl sm:text-right">
            Apple, iPhone, Apple Watch e AirPods são marcas registradas da Apple Inc. Imagens meramente ilustrativas.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
