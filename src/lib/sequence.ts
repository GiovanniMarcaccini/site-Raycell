/**
 * Configuração da sequência cinematográfica.
 *
 * Vídeo original: 1280x720, 24 fps, 10 s => 240 frames, apenas 3 keyframes H.264.
 * Com tão poucos keyframes, `video.currentTime` faz o decoder voltar ao keyframe
 * anterior a cada seek (até ~4 s de vídeo), o que gera travadas visíveis — por isso
 * a renderização usa frames WebP pré-extraídos em <canvas>.
 * Os frames são gerados por scripts/prepare-sequence.py.
 */

export type SequenceSource = {
  id: "desktop" | "mobile";
  path: string;
  count: number;
  width: number;
  height: number;
};

export const SOURCE_FRAME_COUNT = 240;

export const SEQUENCES: Record<SequenceSource["id"], SequenceSource> = {
  /** Todos os frames, quadro 16:9 completo */
  desktop: { id: "desktop", path: "/sequence/desktop", count: 240, width: 1280, height: 720 },
  /** Metade dos frames, recorte central 640x720 — ~4x menos memória */
  mobile: { id: "mobile", path: "/sequence/mobile", count: 120, width: 640, height: 720 },
};

/** Mesma condição do CSS `.evolution-frame` (portrait + estreito). */
export const MOBILE_SEQUENCE_QUERY = "(max-width: 767px) and (orientation: portrait)";

export const frameUrl = (source: SequenceSource, index: number) =>
  `${source.path}/${String(index).padStart(3, "0")}.webp`;

/**
 * Linha do tempo normalizada (0 → 1) do scroll da seção.
 *
 * A narrativa é dividida em "batidas": em cada momento de texto o vídeo
 * avança devagar (o visitante lê com o aparelho quase parado) e entre os
 * momentos ele flui para a geração seguinte. A curva passa pelos pontos de
 * PACING com interpolação cúbica monotônica — a velocidade muda de forma
 * contínua, sem trancos, e o vídeo nunca volta para trás.
 *
 * - 0 → VIDEO_END : vídeo (frames 0 → 239)
 * - VIDEO_END → 1 : transição de luz para a seção da marca
 */
export const VIDEO_END = 0.8;

/** [tempo normalizado, frame original]. Ajuste aqui o ritmo da animação. */
export const PACING: [number, number][] = [
  [0, 0],
  [0.05, 3], //    hero: aparelho praticamente parado
  [0.1, 16], //    entra o primeiro iPhone
  [0.18, 32], //   01 · O começo (lento)
  [0.23, 56], //   transição
  [0.31, 72], //   02 · A transformação (lento)
  [0.37, 104], //  transição para as telas sem bordas
  [0.49, 142], //  03 · Uma nova geração (lento)
  [0.56, 165], //  transição para o dobrável
  [0.78, 239], //  04 · O futuro (velocidade constante até o último frame)
];

export type Moment = {
  id: string;
  step: string;
  label: string;
  title: string;
  body: string;
  /** Janela na timeline normalizada */
  start: number;
  end: number;
  align: "left" | "right";
  note?: string;
};

/* Janelas de texto alinhadas às batidas lentas de PACING. */
export const MOMENTS: Moment[] = [
  {
    id: "comeco",
    step: "01",
    label: "O começo",
    title: "Toda revolução tem um começo.",
    body: "Uma tela, um botão e uma ideia que mudou a forma como nos conectamos.",
    start: 0.095,
    end: 0.185,
    align: "left",
  },
  {
    id: "transformacao",
    step: "02",
    label: "A transformação",
    title: "A inovação transforma tudo.",
    body: "Geração após geração, cada detalhe foi repensado.",
    start: 0.225,
    end: 0.315,
    align: "right",
  },
  {
    id: "nova-geracao",
    step: "03",
    label: "Uma nova geração",
    title: "O futuro está nas suas mãos.",
    body: "Telas sem bordas, câmeras profissionais e design que impressiona.",
    start: 0.365,
    end: 0.495,
    align: "left",
  },
  {
    id: "futuro",
    step: "04",
    label: "O futuro",
    title: "O próximo capítulo começa agora.",
    body: "Um olhar sobre o que ainda está por vir.",
    start: 0.585,
    end: 0.77,
    align: "right",
    note: "Dispositivo dobrável conceitual, meramente ilustrativo. Não é um produto à venda.",
  },
];

// Tangentes da interpolação cúbica monotônica (Fritsch–Carlson)
const PACING_TANGENTS = (() => {
  const n = PACING.length;
  const delta = PACING.slice(0, -1).map(([t0, f0], i) => (PACING[i + 1][1] - f0) / (PACING[i + 1][0] - t0));
  const m = PACING.map((_, i) => (i === 0 ? delta[0] : i === n - 1 ? delta[n - 2] : (delta[i - 1] + delta[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (delta[i] === 0) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / delta[i];
    const b = m[i + 1] / delta[i];
    const h = a * a + b * b;
    if (h > 9) {
      const k = 3 / Math.sqrt(h);
      m[i] = k * a * delta[i];
      m[i + 1] = k * b * delta[i];
    }
  }
  return m;
})();

/** Converte o tempo normalizado em frame original (0–239), contínuo. */
export function frameAtTime(t: number): number {
  const last = PACING[PACING.length - 1];
  if (t <= 0) return 0;
  if (t >= last[0]) return last[1];
  let i = 0;
  while (t > PACING[i + 1][0]) i++;
  const [t0, f0] = PACING[i];
  const [t1, f1] = PACING[i + 1];
  const h = t1 - t0;
  const s = (t - t0) / h;
  const s2 = s * s;
  const s3 = s2 * s;
  return (
    (2 * s3 - 3 * s2 + 1) * f0 +
    (s3 - 2 * s2 + s) * h * PACING_TANGENTS[i] +
    (-2 * s3 + 3 * s2) * f1 +
    (s3 - s2) * h * PACING_TANGENTS[i + 1]
  );
}

/** Inverso de frameAtTime (busca binária) — sincroniza efeitos a um frame. */
export function timeAtFrame(frame: number): number {
  let lo = 0;
  let hi = PACING[PACING.length - 1][0];
  for (let k = 0; k < 30; k++) {
    const mid = (lo + hi) / 2;
    if (frameAtTime(mid) < frame) lo = mid;
    else hi = mid;
  }
  return hi;
}

/*
 * "Push-in" aplicado pelo scripts/prepare-sequence.py nos frames 148–162 para
 * tirar do quadro a interface gravada no vídeo original. No palco, o canvas é
 * reduzido na mesma proporção (compensação) — o aparelho mantém o tamanho do
 * vídeo original e as bordas se dissolvem no fundo do palco.
 * Mantenha estes valores iguais aos do script.
 */
export const ZOOM_RAMP = { start: 148, end: 162, fromH: 720, toH: 530 };

export function bakedZoomCompensation(frame: number) {
  const x = Math.min(1, Math.max(0, (frame - ZOOM_RAMP.start) / (ZOOM_RAMP.end - ZOOM_RAMP.start)));
  const t = x * x * (3 - 2 * x);
  const h = ZOOM_RAMP.fromH + (ZOOM_RAMP.toH - ZOOM_RAMP.fromH) * t;
  return h / ZOOM_RAMP.fromH;
}

/** Índice do conjunto carregado → frame original (0–239). */
export const toOriginalFrame = (source: SequenceSource, index: number) =>
  (index / (source.count - 1)) * (SOURCE_FRAME_COUNT - 1);

/** Converte índice do frame original no índice do conjunto carregado. */
export const toSourceIndex = (source: SequenceSource, frame: number) =>
  Math.min(source.count - 1, Math.max(0, Math.round((frame / (SOURCE_FRAME_COUNT - 1)) * (source.count - 1))));
