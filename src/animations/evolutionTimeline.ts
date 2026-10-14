"use client";

import { gsap } from "./gsap";
import { VIDEO_END, type EvolutionVariant, type Pacing } from "@/lib/sequence";

export type EvolutionTargets = {
  section: HTMLElement;
  stage: HTMLElement;
  hero: HTMLElement;
  hint: HTMLElement;
  scaler: HTMLElement;
  bloom: HTMLElement;
  rail: HTMLElement | null;
  railFill: HTMLElement | null;
  railSteps: HTMLElement[];
  moments: HTMLElement[];
};

/**
 * Uma única timeline (duração 1) controlada pelo scroll da seção.
 * O tempo da timeline é a "fonte da verdade": `onTime` recebe o tempo e o
 * componente converte em frame (ver frameAtTime). Textos, trilho de progresso
 * e a transição final vivem na mesma timeline, então nunca dessincronizam.
 */
export function createEvolutionTimeline(
  t: EvolutionTargets,
  {
    scrub,
    onTime,
    variant,
    pacing,
  }: { scrub: number | boolean; onTime: (time: number) => void; variant: EvolutionVariant; pacing: Pacing },
) {
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: t.section,
      start: "top top",
      end: "bottom bottom",
      scrub,
      invalidateOnRefresh: true,
    },
    onUpdate: () => onTime(tl.time()),
  });

  // Garante duração total = 1
  tl.set({}, {}, 1);

  // Hero sai ao primeiro movimento
  tl.to(t.hint, { autoAlpha: 0, duration: 0.025 }, 0);
  tl.to(t.hero, { autoAlpha: 0, y: -48, duration: 0.05, ease: "power1.in" }, 0.004);

  // Momentos narrativos
  variant.moments.forEach((m, i) => {
    const el = t.moments[i];
    if (!el) return;
    const fade = Math.min(0.03, (m.end - m.start) / 4);
    tl.fromTo(
      el,
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0, duration: fade, ease: "power2.out" },
      m.start,
    );
    tl.to(el, { autoAlpha: 0, y: -36, duration: fade, ease: "power2.in" }, m.end - fade);

    const step = t.railSteps[i];
    if (step) {
      tl.to(step, { opacity: 1, duration: fade }, m.start);
      tl.to(step, { opacity: 0.38, duration: fade }, m.end - fade);
    }
  });

  // Trilho de progresso
  if (t.rail && t.railFill) {
    tl.fromTo(t.rail, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0.03);
    tl.fromTo(t.railFill, { scaleX: 0 }, { scaleX: 1, duration: VIDEO_END - 0.03 }, 0.03);
    tl.to(t.rail, { autoAlpha: 0, duration: 0.03 }, VIDEO_END - 0.01);
  }

  // O dobrável chega com o quadro reduzido (compensação do push-in): o fundo do
  // palco clareia junto para as bordas do vídeo continuarem invisíveis.
  const ramp = variant.zoomRamp;
  if (ramp) tl.to(
    t.stage,
    {
      "--stage-top": "#d0d0d2",
      "--stage-mid": "#d9d9da",
      "--stage-bottom": "#d8d7d8",
      "--stage-glow": 0.32,
      duration: pacing.timeAtFrame(ramp.end) - pacing.timeAtFrame(ramp.start),
      ease: "sine.inOut",
    },
    pacing.timeAtFrame(ramp.start),
  );

  // Final: leve aproximação + "abertura de luz" para a seção da marca
  tl.fromTo(t.scaler, { scale: 1 }, { scale: 1.07, duration: 1 - (VIDEO_END - 0.04), ease: "power1.in" }, VIDEO_END - 0.04);
  tl.fromTo(t.bloom, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: "power1.inOut" }, VIDEO_END + 0.04);

  return tl;
}
