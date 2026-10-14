import { frameUrl, type SequenceSource } from "./sequence";

type Options = {
  /** Requisições simultâneas (evita saturar a rede/decoder no mobile) */
  concurrency?: number;
  onProgress?: (loaded: number, total: number) => void;
  onFrame?: (index: number) => void;
};

/**
 * Carregador progressivo de frames.
 *
 * Ordem de carregamento "coarse → fine": primeiro o frame 0 (poster), depois
 * 1 a cada 32 frames, 16, 8, 4, 2 e por fim todos. Em poucos KB a sequência
 * inteira já é "navegável" e vai ganhando resolução temporal enquanto o
 * usuário lê o hero. Se o usuário rolar para uma região ainda não carregada,
 * `prioritize()` adianta os frames próximos.
 */
export class FrameSequence {
  readonly source: SequenceSource;
  private images: (HTMLImageElement | null)[];
  private ready: boolean[];
  private queue: number[] = [];
  private queued = new Set<number>();
  private inflight = new Map<number, HTMLImageElement>();
  private loadedCount = 0;
  private destroyed = false;
  private readonly concurrency: number;
  private readonly opts: Options;

  constructor(source: SequenceSource, opts: Options = {}) {
    this.source = source;
    this.opts = opts;
    this.concurrency = opts.concurrency ?? 6;
    this.images = new Array(source.count).fill(null);
    this.ready = new Array(source.count).fill(false);
  }

  get total() {
    return this.source.count;
  }
  get loaded() {
    return this.loadedCount;
  }

  /** Inicia o carregamento. Resolve quando o primeiro frame estiver decodificado. */
  start(): Promise<void> {
    const order: number[] = [0];
    for (const stride of [32, 16, 8, 4, 2, 1]) {
      for (let i = 0; i < this.source.count; i += stride) order.push(i);
    }
    order.push(this.source.count - 1);
    for (const i of order) this.enqueue(i);

    return new Promise((resolve) => {
      const check = () => {
        if (this.ready[0] || this.destroyed) resolve();
        else requestAnimationFrame(check);
      };
      this.pump();
      check();
    });
  }

  /** Antecipa frames ao redor de `index` (scroll rápido para área não carregada). */
  prioritize(index: number, radius = 6) {
    if (this.destroyed) return;
    const wanted: number[] = [];
    for (let d = 0; d <= radius; d++) {
      for (const i of d === 0 ? [index] : [index + d, index - d]) {
        if (i >= 0 && i < this.source.count && !this.ready[i] && !this.inflight.has(i)) wanted.push(i);
      }
    }
    if (!wanted.length) return;
    this.queue = wanted.concat(this.queue.filter((i) => !wanted.includes(i)));
    wanted.forEach((i) => this.queued.add(i));
    this.pump();
  }

  /** Índice do frame pronto mais próximo de `index` (-1 se nenhum). Nunca há "buraco" preto. */
  nearestReady(index: number): number {
    if (this.ready[index]) return index;
    for (let d = 1; d < this.source.count; d++) {
      const a = index - d;
      const b = index + d;
      if (a >= 0 && this.ready[a]) return a;
      if (b < this.source.count && this.ready[b]) return b;
    }
    return -1;
  }

  image(index: number): HTMLImageElement | null {
    return this.ready[index] ? this.images[index] : null;
  }

  /** Fonte de desenho do frame (já decodificada via img.decode()). */
  drawable(index: number): CanvasImageSource | null {
    return this.image(index);
  }

  isReady(index: number) {
    return this.ready[index];
  }

  destroy() {
    this.destroyed = true;
    this.queue = [];
    this.queued.clear();
    this.inflight.forEach((img) => {
      img.onload = img.onerror = null;
      img.src = "";
    });
    this.inflight.clear();
    this.images = [];
    this.ready = [];
  }

  private enqueue(i: number) {
    if (this.queued.has(i)) return;
    this.queued.add(i);
    this.queue.push(i);
  }

  private pump() {
    while (!this.destroyed && this.inflight.size < this.concurrency && this.queue.length) {
      const i = this.queue.shift()!;
      if (this.ready[i] || this.inflight.has(i)) continue;
      this.load(i);
    }
  }

  private load(i: number) {
    const img = new Image();
    img.decoding = "async";
    // Primeiro frame e os da 1ª passada com prioridade alta
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = i % 32 === 0 ? "high" : "low";
    this.inflight.set(i, img);

    const done = (ok: boolean) => {
      if (this.destroyed) return;
      this.inflight.delete(i);
      if (ok) {
        this.images[i] = img;
        this.ready[i] = true;
        this.loadedCount++;
        this.opts.onFrame?.(i);
        this.opts.onProgress?.(this.loadedCount, this.source.count);
      }
      this.pump();
    };

    img.onload = () => {
      // decode() garante que o drawImage não vai decodificar na thread principal
      if (typeof img.decode === "function") img.decode().then(() => done(true), () => done(true));
      else done(true);
    };
    img.onerror = () => done(false);
    img.src = frameUrl(this.source, i);
  }
}
