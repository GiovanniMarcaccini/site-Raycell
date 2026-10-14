import Image from "next/image";
import { MOMENTS } from "@/lib/sequence";

const STILLS = ["/sequence/stills/f24.webp", "/sequence/stills/f72.webp", "/sequence/stills/f140.webp", "/sequence/stills/f228.webp"];

/**
 * Versão para `prefers-reduced-motion`: a mesma narrativa em quadros
 * estáticos, sem pin nem scroll longo.
 */
export function ReducedMotionEvolution() {
  return (
    <section id="evolucao" aria-label="A evolução do iPhone" className="evolution-stage pt-[var(--header-h)]">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-12 text-center lg:pt-20">
        <p className="eyebrow text-ink-2!">Raycell Imports</p>
        <h1 className="display mx-auto mt-4 max-w-3xl text-[clamp(2.1rem,5.4vw,4.5rem)]">
          A evolução da tecnologia começa aqui.
        </h1>
        <p className="mt-4 text-lg text-ink-2">Descubra uma nova forma de viver a inovação.</p>
      </div>
      <ol className="mx-auto grid max-w-6xl gap-x-8 gap-y-14 px-6 pb-24 md:grid-cols-2">
        {MOMENTS.map((m, i) => (
          <li key={m.id}>
            <div className="relative aspect-video overflow-hidden rounded-2xl">
              <Image src={STILLS[i]} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <p className="eyebrow mt-6 text-ink-2!">
              {m.step} · {m.label}
            </p>
            <h2 className="display mt-2 text-3xl">{m.title}</h2>
            <p className="mt-2 text-ink-2">{m.body}</p>
            {m.note && <p className="mt-3 text-xs text-ink-2">{m.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
