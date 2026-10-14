"use client";

import { useCallback, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/animations/gsap";
import { createEvolutionTimeline } from "@/animations/evolutionTimeline";
import { FrameSequence } from "@/lib/frame-sequence";
import {
  MOBILE_SEQUENCE_QUERY,
  SEQUENCES,
  bakedZoomCompensation,
  frameAtTime,
  frameUrl,
  toOriginalFrame,
  SOURCE_FRAME_COUNT,
  type SequenceSource,
} from "@/lib/sequence";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { EvolutionOverlay } from "./EvolutionOverlay";
import { ReducedMotionEvolution } from "./ReducedMotionEvolution";

/**
 * Seção principal: a rolagem controla a evolução dos iPhones.
 *
 * Estratégia
 * - Palco `position: sticky` dentro de uma seção alta (CSS). É o "pin" nativo
 *   do navegador: não cria pin-spacer, não reflowa e não treme no scroll por
 *   inércia do iOS. O ScrollTrigger cuida do progresso com `scrub`.
 * - Frames WebP desenhados em <canvas> (ver lib/sequence.ts para o motivo).
 * - Desktop: 240 frames 1280x720 · Mobile retrato: 120 frames 640x720.
 * - O canvas só redesenha quando o frame muda; o desenho acontece no ticker
 *   do GSAP (requestAnimationFrame).
 */
export function ScrollEvolution() {
  const reduced = useReducedMotion();
  return reduced ? <ReducedMotionEvolution /> : <CinematicEvolution />;
}

function CinematicEvolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const momentEls = useRef<HTMLElement[]>([]);
  const railStepEls = useRef<HTMLElement[]>([]);

  const momentRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      if (el) momentEls.current[i] = el;
    },
    [],
  );
  const railStepRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      if (el) railStepEls.current[i] = el;
    },
    [],
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { mobile: MOBILE_SEQUENCE_QUERY, desktop: `not all and ${MOBILE_SEQUENCE_QUERY}`, coarse: "(pointer: coarse)" },
        (ctx) => {
          const { mobile, coarse } = ctx.conditions as { mobile: boolean; coarse: boolean };
          const source = mobile ? SEQUENCES.mobile : SEQUENCES.desktop;
          return setupSequence(source, { scrub: coarse ? 0.5 : 0.8 });
        },
      );

      function setupSequence(source: SequenceSource, { scrub }: { scrub: number }) {
        const canvas = canvasRef.current!;
        const frameEl = frameRef.current!;
        const ctx2d = canvas.getContext("2d", { alpha: false });
        if (!ctx2d) return;

        /** Posição contínua no conjunto carregado (ex.: 41.37) */
        let pos = 0;
        let drawnKey = "";
        let comp = 1;
        const compEl = compRef.current!;
        let shown = false;
        const loaderText = loaderRef.current?.querySelector<HTMLElement>("[data-loader-text]");

        /*
         * Desenho com "frame blending": entre dois frames vizinhos o segundo é
         * sobreposto com opacidade proporcional à posição. O vídeo tem 24 fps
         * (12 no mobile); sem isso, numa rolagem lenta cada frame fica parado
         * por vários quadros da tela e o movimento parece "escadinha".
         */
        const draw = () => {
          const base = Math.floor(pos);
          const a = seq.nearestReady(base);
          if (a < 0) return;
          let b = -1;
          let alpha = 0;
          const frac = pos - base;
          if (a === base && frac > 0.04 && base + 1 < seq.total && seq.isReady(base + 1)) {
            b = base + 1;
            alpha = Math.round(frac * 20) / 20;
          }
          const key = `${a}:${b}:${alpha}:${canvas.width}`;
          if (key === drawnKey) return;
          const srcA = seq.drawable(a)!;
          ctx2d.globalAlpha = 1;
          ctx2d.drawImage(srcA, 0, 0, canvas.width, canvas.height);
          if (b >= 0) {
            ctx2d.globalAlpha = alpha;
            ctx2d.drawImage(seq.drawable(b)!, 0, 0, canvas.width, canvas.height);
            ctx2d.globalAlpha = 1;
          }
          drawnKey = key;
          // Compensação do push-in "assado" nos frames — no mesmo tick do desenho
          const nextComp = bakedZoomCompensation(toOriginalFrame(source, b >= 0 ? a + alpha : a));
          if (Math.abs(nextComp - comp) > 0.0005) {
            comp = nextComp;
            compEl.style.transform = comp < 0.9995 ? `scale(${comp.toFixed(4)})` : "";
          }
          if (!shown) {
            shown = true;
            canvas.style.opacity = "1";
          }
        };

        const seq = new FrameSequence(source, {
          concurrency: mobileSafeConcurrency(),
          // Um frame chegou: redesenha só se mudar o resultado
          onFrame: () => draw(),
          onProgress: (loaded, total) => {
            // A sequência fica fluida quando a passada de 1/4 está completa
            const pct = Math.min(100, Math.round((loaded / (total / 4)) * 100));
            if (loaderText) loaderText.textContent = `Preparando a experiência · ${pct}%`;
            if (loaded >= total / 4) hideLoader();
          },
        });

        // Só exibe o indicador se a rede estiver lenta
        const loaderTimer = window.setTimeout(() => {
          if (loaderRef.current && seq.loaded < seq.total / 4) loaderRef.current.style.opacity = "1";
        }, 900);
        const hideLoader = () => {
          window.clearTimeout(loaderTimer);
          if (loaderRef.current) loaderRef.current.style.opacity = "0";
        };

        const resize = () => {
          // offsetWidth = tamanho de layout (ignora as escalas aplicadas via transform)
          const cssWidth = frameEl.offsetWidth;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          // Nunca acima da resolução do frame (não há ganho) — economiza memória
          const w = Math.max(1, Math.min(source.width, Math.round(cssWidth * dpr)));
          const h = Math.round((w * source.height) / source.width);
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            ctx2d.imageSmoothingEnabled = true;
            ctx2d.imageSmoothingQuality = "high";
            drawnKey = "";
            draw();
          }
        };
        const ro = new ResizeObserver(resize);
        ro.observe(frameEl);
        resize();

        const setTime = (time: number) => {
          const next = (frameAtTime(time) / (SOURCE_FRAME_COUNT - 1)) * (source.count - 1);
          if (Math.abs(next - pos) < 0.001) return;
          pos = next;
          const base = Math.floor(pos);
          if (!seq.isReady(base) || !seq.isReady(Math.min(seq.total - 1, base + 1))) seq.prioritize(base);
          draw();
        };

        const tl = createEvolutionTimeline(
          {
            section: sectionRef.current!,
            stage: stageRef.current!,
            hero: heroRef.current!,
            hint: hintRef.current!,
            scaler: scalerRef.current!,
            bloom: bloomRef.current!,
            rail: railRef.current,
            railFill: railFillRef.current,
            railSteps: railStepEls.current,
            moments: momentEls.current,
          },
          { scrub, onTime: setTime },
        );

        seq.start().then(() => {
          pos = -1;
          setTime(tl.time());
          drawnKey = "";
          draw();
        });

        return () => {
          window.clearTimeout(loaderTimer);
          ro.disconnect();
          seq.destroy();
          canvas.style.opacity = "0";
          compEl.style.transform = "";
        };
      }

      // Recalcula posições quando fontes/imagens acima mudarem o layout
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="evolucao"
      ref={sectionRef}
      aria-label="A evolução do iPhone"
      className="evolution-section relative"
    >
      <div ref={stageRef} className="evolution-stage sticky top-0 h-svh w-full overflow-hidden">
        <div ref={scalerRef} className="absolute inset-0 will-change-transform">
          <div ref={compRef} className="absolute inset-0">
          <div ref={frameRef} className="evolution-frame">
            {/* Poster = frame 0 do conjunto certo. Mesmo retângulo do canvas → sem salto. */}
            <picture>
              <source media={MOBILE_SEQUENCE_QUERY} srcSet={frameUrl(SEQUENCES.mobile, 0)} width={640} height={720} />
              <img
                src={frameUrl(SEQUENCES.desktop, 0)}
                alt="Primeiro iPhone em um estúdio branco minimalista"
                width={1280}
                height={720}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full"
              />
            </picture>
            <canvas
              ref={canvasRef}
              aria-hidden
              className="opacity-0 transition-opacity duration-300"
            />
          </div>
          </div>
        </div>

        <EvolutionOverlay
          heroRef={heroRef}
          hintRef={hintRef}
          railRef={railRef}
          railFillRef={railFillRef}
          loaderRef={loaderRef}
          railStepRef={railStepRef}
          momentRef={momentRef}
        />

        {/* Luz final que se abre na seção da marca */}
        <div ref={bloomRef} aria-hidden className="pointer-events-none invisible absolute inset-0 z-20 bg-white opacity-0" />
      </div>
    </section>
  );
}

function mobileSafeConcurrency() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
  if (nav.connection?.saveData) return 2;
  if (nav.connection?.effectiveType && /2g|3g/.test(nav.connection.effectiveType)) return 3;
  return 6;
}
