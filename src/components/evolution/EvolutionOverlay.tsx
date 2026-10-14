import type { Ref } from "react";
import { ChevronDown } from "lucide-react";
import { MOMENTS } from "@/lib/sequence";

type Props = {
  heroRef: Ref<HTMLDivElement>;
  hintRef: Ref<HTMLDivElement>;
  railRef: Ref<HTMLDivElement>;
  railFillRef: Ref<HTMLDivElement>;
  loaderRef: Ref<HTMLDivElement>;
  railStepRef: (i: number) => (el: HTMLElement | null) => void;
  momentRef: (i: number) => (el: HTMLElement | null) => void;
};

/**
 * Camada tipográfica sobre o vídeo. Puramente estrutural: toda a
 * coreografia fica em animations/evolutionTimeline.ts.
 */
export function EvolutionOverlay({ heroRef, hintRef, railRef, railFillRef, loaderRef, railStepRef, momentRef }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* HERO */}
      <div
        ref={heroRef}
        className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] px-6 text-center wide:inset-y-0 wide:bottom-auto wide:top-0 wide:h-full wide:flex wide:items-center wide:px-[6vw] wide:text-left"
      >
        <div className="mx-auto max-w-md wide:mx-0 wide:max-w-[33vw]">
          <p className="eyebrow rise-in text-ink-2!" style={{ animationDelay: "150ms" }}>
            Raycell Imports
          </p>
          <h1 className="display rise-in mt-4 text-[clamp(2.1rem,4.3vw,4.25rem)] text-ink" style={{ animationDelay: "280ms" }}>
            A evolução da tecnologia começa aqui.
          </h1>
          <p
            className="rise-in mt-4 text-[clamp(1rem,1.35vw,1.25rem)] leading-snug text-ink-2 wide:mt-6"
            style={{ animationDelay: "460ms" }}
          >
            Descubra uma nova forma de viver a inovação.
          </p>
        </div>
      </div>

      {/* Indicação de scroll */}
      <div
        ref={hintRef}
        className="absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-2 text-ink-2"
      >
        <span className="rise-in text-[0.7rem] font-medium uppercase tracking-[0.22em]" style={{ animationDelay: "900ms" }}>
          Role para explorar
        </span>
        <ChevronDown aria-hidden className="hint-move size-4" strokeWidth={1.5} />
      </div>

      {/* MOMENTOS */}
      {MOMENTS.map((m, i) => (
        <article
          key={m.id}
          ref={momentRef(i)}
          aria-label={m.label}
          className={[
            "moment absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+3.25rem)] px-6 text-center",
            "wide:inset-x-auto wide:bottom-auto wide:top-1/2 wide:w-[24vw] wide:max-w-[26rem] wide:-translate-y-1/2 wide:px-0 wide:text-left",
            m.align === "left" ? "wide:left-[6vw]" : "wide:right-[6vw]",
          ].join(" ")}
        >
          <p className="eyebrow text-ink-2!">
            <span className="tabular-nums">{m.step}</span>
            <span className="mx-2 inline-block h-px w-6 translate-y-[-0.25em] bg-current align-middle opacity-50" />
            {m.label}
          </p>
          <h2 className="display mt-3 text-[clamp(1.55rem,3.2vw,3.25rem)] text-ink">{m.title}</h2>
          <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-relaxed text-ink-2 wide:mx-0 wide:mt-4 wide:text-base">{m.body}</p>
          {m.note && (
            <p className="mx-auto mt-4 inline-flex max-w-sm items-center gap-2 rounded-full border border-black/10 bg-white/50 px-3 py-1.5 text-[0.7rem] leading-tight text-ink-2 backdrop-blur-sm wide:mx-0">
              {m.note}
            </p>
          )}
        </article>
      ))}

      {/* Trilho de progresso */}
      <div
        ref={railRef}
        aria-hidden
        className="invisible absolute inset-x-6 bottom-[max(1.75rem,env(safe-area-inset-bottom))] opacity-0 wide:inset-x-auto wide:left-1/2 wide:w-[min(58rem,74vw)] wide:-translate-x-1/2"
      >
        <div className="hidden grid-cols-4 wide:grid">
          {MOMENTS.map((m, i) => (
            <span
              key={m.id}
              ref={railStepRef(i)}
              className="truncate pb-3 pr-3 text-[0.66rem] font-medium uppercase tracking-[0.14em] text-ink opacity-[0.38]"
            >
              {m.step} · {m.label}
            </span>
          ))}
        </div>
        <div className="h-px w-full bg-black/12">
          <div ref={railFillRef} className="h-px w-full origin-left scale-x-0 bg-ink" />
        </div>
      </div>

      {/* Carregamento progressivo */}
      <div
        ref={loaderRef}
        role="status"
        aria-live="polite"
        className="absolute right-6 top-[calc(var(--header-h)+1rem)] flex items-center gap-2 text-[0.7rem] font-medium tracking-wide text-ink-2 opacity-0 transition-opacity duration-500"
      >
        <span className="relative inline-block size-3">
          <span className="absolute inset-0 animate-spin rounded-full border border-black/15 border-t-ink" />
        </span>
        <span data-loader-text>Preparando a experiência</span>
      </div>
    </div>
  );
}
