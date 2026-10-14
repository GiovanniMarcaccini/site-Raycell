import type { EvolutionVariant } from "./sequence";

/**
 * Variante de teste (/index2) com o vídeo v2: iPhones → Apple Watch → AirPods
 * → MacBook → iMac → ecossistema completo.
 *
 * Frames gerados com:
 *   python3 scripts/prepare-sequence.py v2.webm --out sequence-v2 --no-push-in --stills 56,96,136,176,224
 */
export const V2: EvolutionVariant = {
  sequences: {
    desktop: { id: "desktop", path: "/sequence-v2/desktop", count: 240, width: 1280, height: 720 },
    mobile: { id: "mobile", path: "/sequence-v2/mobile", count: 120, width: 640, height: 720 },
  },
  /** [tempo normalizado, frame original] — batidas lentas nos momentos de texto */
  pacing: [
    [0, 0],
    [0.04, 4], //    hero: iPhone clássico praticamente parado
    [0.09, 36], //   giro do iPhone clássico
    [0.16, 60], //   01 · iPhone (X → Pro, lento)
    [0.2, 78], //    transição para o Watch
    [0.27, 102], //  02 · Apple Watch (lento)
    [0.31, 118], //  transição para os AirPods
    [0.38, 144], //  03 · AirPods (lento)
    [0.43, 160], //  transição para o MacBook
    [0.52, 188], //  04 · Mac (lento)
    [0.58, 212], //  iMac → ecossistema
    [0.78, 239], //  ecossistema (fechamento, sem texto)
  ],
  moments: [
    {
      id: "iphone",
      step: "01",
      label: "iPhone",
      title: "Onde tudo começou.",
      body: "Do clássico ao Pro: cada geração redefiniu o que um celular pode fazer.",
      start: 0.095,
      end: 0.165,
      align: "left",
    },
    {
      id: "watch",
      step: "02",
      label: "Apple Watch",
      title: "Tecnologia no seu pulso.",
      body: "Saúde, treinos e notificações em um só olhar.",
      start: 0.205,
      end: 0.275,
      align: "right",
    },
    {
      id: "airpods",
      step: "03",
      label: "AirPods",
      title: "Som que envolve.",
      body: "Áudio imersivo, cancelamento de ruído e conexão instantânea.",
      start: 0.315,
      end: 0.385,
      align: "left",
    },
    {
      id: "mac",
      step: "04",
      label: "Mac",
      title: "Potência para criar.",
      body: "Desempenho e design para quem trabalha, estuda e cria.",
      start: 0.435,
      end: 0.525,
      align: "right",
    },
    // O ecossistema final ocupa o quadro inteiro: sem texto, ele mesmo é o
    // fechamento e leva direto para a seção da marca.
  ],
  zoomRamp: null,
  stills: [
    "/sequence-v2/stills/f56.webp",
    "/sequence-v2/stills/f96.webp",
    "/sequence-v2/stills/f136.webp",
    "/sequence-v2/stills/f176.webp",
  ],
  posterAlt: "iPhone clássico em um estúdio branco minimalista",
};
