"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, AtSign, Clock, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/catalog";
import { isWhatsAppConfigured, whatsappLink } from "@/lib/whatsapp";
import { Reveal } from "../ui/Reveal";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";

export function ContactSection() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState<string>(categories[0].name);
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = [
      `Olá, Raycell Imports! Meu nome é ${name.trim() || "—"}.`,
      `Tenho interesse em: ${interest}.`,
      message.trim() && `Mensagem: ${message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
    const link = whatsappLink(text);
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  const direct = whatsappLink();
  const details = [
    siteConfig.email && { icon: Mail, label: siteConfig.email, href: `mailto:${siteConfig.email}` },
    siteConfig.location && { icon: MapPin, label: siteConfig.location },
    siteConfig.hours && { icon: Clock, label: siteConfig.hours },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href?: string }[];

  return (
    <Reveal as="section" id="contato" aria-labelledby="contato-title" className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <p data-reveal className="eyebrow">
            Contato
          </p>
          <h2 data-reveal id="contato-title" className="display mt-4 text-[clamp(2.2rem,4.6vw,4rem)]">
            Fale com a Raycell.
          </h2>
          <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
            Tire dúvidas, consulte disponibilidade e receba atendimento personalizado.
          </p>

          <div data-reveal className="mt-10 flex flex-wrap gap-3">
            {direct ? (
              <a
                href={direct}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-sm font-medium text-white transition hover:bg-black"
              >
                <WhatsAppIcon className="size-4" /> Conversar no WhatsApp
              </a>
            ) : (
              <span className="inline-flex h-12 items-center gap-2.5 rounded-full bg-surface px-6 text-sm text-muted">
                <WhatsAppIcon className="size-4" /> WhatsApp em configuração
              </span>
            )}
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-full border border-line-strong px-6 text-sm font-medium transition hover:border-ink"
            >
              <AtSign className="size-4" strokeWidth={1.75} /> {siteConfig.instagram.handle}
              <ArrowUpRight className="size-3.5 text-muted" />
            </a>
          </div>

          {details.length > 0 && (
            <ul data-reveal className="mt-10 space-y-3 text-sm text-ink-2">
              {details.map(({ icon: Icon, label, href }) => (
                <li key={label} className="flex items-center gap-3">
                  <Icon className="size-4 text-metal-3" strokeWidth={1.5} />
                  {href ? (
                    <a href={href} className="hover:text-ink">
                      {label}
                    </a>
                  ) : (
                    label
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <form data-reveal onSubmit={onSubmit} className="rounded-[2rem] border border-line bg-surface/60 p-7 sm:p-10" aria-describedby="form-hint">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Seu nome" htmlFor="c-name">
              <input
                id="c-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className="h-12 w-full rounded-xl border border-line-strong bg-white px-4 text-[0.95rem] outline-none transition focus:border-ink"
              />
            </Field>
            <Field label="Interesse" htmlFor="c-interest">
              <select
                id="c-interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-line-strong bg-white px-4 text-[0.95rem] outline-none transition focus:border-ink"
              >
                {categories.map((c) => (
                  <option key={c.slug}>{c.name}</option>
                ))}
                <option>Outro assunto</option>
              </select>
            </Field>
          </div>
          <Field label="Mensagem" htmlFor="c-msg" className="mt-5">
            <textarea
              id="c-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-line-strong bg-white px-4 py-3 text-[0.95rem] outline-none transition focus:border-ink"
            />
          </Field>
          <button
            type="submit"
            disabled={!isWhatsAppConfigured}
            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-muted"
          >
            <WhatsAppIcon className="size-4" /> Enviar pelo WhatsApp
          </button>
          <p id="form-hint" className="mt-3 text-center text-xs text-muted">
            {isWhatsAppConfigured
              ? "A mensagem é aberta no WhatsApp para você revisar antes de enviar."
              : "Configure NEXT_PUBLIC_WHATSAPP_NUMBER para ativar o envio."}
          </p>
        </form>
      </div>
    </Reveal>
  );
}

function Field({ label, htmlFor, className = "", children }: { label: string; htmlFor: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
