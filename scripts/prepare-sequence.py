#!/usr/bin/env python3
"""
Gera as sequências de frames usadas pela animação de scroll (ScrollEvolution).

Uso:
    python3 scripts/prepare-sequence.py caminho/do/video.mp4
    python3 scripts/prepare-sequence.py v2.webm --out sequence-v2 --no-push-in --stills 56,96,136,176,224

Opções:
    --out PASTA       subpasta de public/ (padrão: sequence)
    --no-push-in      não aplica o push-in dos frames finais (vídeos sem interface gravada)
    --stills A,B,...  frames salvos como stills (padrão: 0,24,72,112,140,228)

Requisitos: ffmpeg no PATH e Pillow (pip install pillow).

O que o script faz
------------------
1. Extrai os 240 frames do vídeo (1280x720, 24 fps, 10 s).
2. Aplica um "push-in" de câmera nos frames finais (≈150–162): o vídeo original
   traz uma interface de site gerada por IA "gravada" no topo e uma barra branca
   na base a partir do frame ~160. O enquadramento sobe/aproxima suavemente para
   que esses elementos fiquem fora do quadro, sem cortar os aparelhos.
3. Gera dois conjuntos WebP:
   - desktop: 240 frames 1280x720 (todos os frames)
   - mobile:  120 frames 640x720 (1 a cada 2 frames, recorte central do aparelho)
4. Gera stills para a versão prefers-reduced-motion e o poster do hero.
"""
import argparse
import os
import subprocess
import sys
import tempfile

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SRC_W, SRC_H = 1280, 720
OUT_W, OUT_H = 1280, 720  # 16:9 (quadro original)
MOBILE_W = 640

# Janela final (sem a interface gravada no vídeo): y 95..625
LATE_TOP, LATE_BOTTOM = 95, 625
RAMP_START, RAMP_END = 148, 162

STILLS = [0, 24, 72, 112, 140, 228]


def smoothstep(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def crop_box(n: int, push_in: bool = True):
    if not push_in:
        return (0, 0, SRC_W, SRC_H)
    t = smoothstep((n - RAMP_START) / (RAMP_END - RAMP_START))
    h = SRC_H + (LATE_BOTTOM - LATE_TOP - SRC_H) * t  # 720 -> 530
    w = h * OUT_W / OUT_H
    top = 0 + LATE_TOP * t
    left = (SRC_W - w) / 2
    return (left, top, left + w, top + h)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    parser = argparse.ArgumentParser()
    parser.add_argument("video")
    parser.add_argument("--out", default="sequence")
    parser.add_argument("--no-push-in", action="store_true")
    parser.add_argument("--stills", default=",".join(map(str, STILLS)))
    args = parser.parse_args()
    video = args.video
    OUT = os.path.join(ROOT, "public", args.out)
    stills = [int(x) for x in args.stills.split(",")]
    for sub in ("desktop", "mobile", "stills"):
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-i", video, "-start_number", "0",
             os.path.join(tmp, "%03d.png")],
            check=True,
        )
        frames = sorted(f for f in os.listdir(tmp) if f.endswith(".png"))
        for i, name in enumerate(frames):
            im = Image.open(os.path.join(tmp, name)).convert("RGB")
            frame = im.resize((OUT_W, OUT_H), Image.LANCZOS, box=crop_box(i, not args.no_push_in))
            frame.save(os.path.join(OUT, "desktop", f"{i:03d}.webp"), "WEBP", quality=80, method=6)
            if i % 2 == 0:
                left = (OUT_W - MOBILE_W) // 2
                mob = frame.crop((left, 0, left + MOBILE_W, OUT_H))
                mob.save(os.path.join(OUT, "mobile", f"{i // 2:03d}.webp"), "WEBP", quality=78, method=6)
            if i in stills:
                frame.save(os.path.join(OUT, "stills", f"f{i}.webp"), "WEBP", quality=84, method=6)
        print(f"{len(frames)} frames processados")


if __name__ == "__main__":
    main()
