import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { policies, type PolicySlug } from "@/data/policies";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/politicas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies[slug as PolicySlug];
  return policy ? { title: policy.title } : {};
}

export default async function PolicyPage({ params }: PageProps<"/politicas/[slug]">) {
  const { slug } = await params;
  const policy = policies[slug as PolicySlug];
  if (!policy) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 pb-28 pt-[calc(var(--header-h)+4rem)] sm:px-8">
      <p className="eyebrow">Institucional</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">{policy.title}</h1>
      <div className="metal-rule mt-10" />
      <div className="mt-10 space-y-4 text-ink-2">
        <p>
          Este documento está em elaboração. O texto oficial de <strong>{policy.title.toLowerCase()}</strong> da{" "}
          {siteConfig.name} será publicado aqui.
        </p>
        <p className="text-sm text-muted">
          Para dúvidas, fale com a equipe pelos canais da página de{" "}
          <Link href="/#contato" className="underline underline-offset-4">
            contato
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
