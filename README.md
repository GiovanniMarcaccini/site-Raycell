# Raycell Imports — site

Experiência de apresentação + loja para a Raycell Imports (iPhones, Apple Watch, AirPods e acessórios).
O scroll controla a evolução dos iPhones do vídeo fornecido, do primeiro modelo até um dobrável conceitual.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · GSAP 3 + ScrollTrigger · Lucide · Geist.

## Rodando

```bash
npm install
cp .env.example .env.local   # preencha WhatsApp e demais dados reais
npm run dev                  # http://localhost:3000
npm run build && npm start   # produção
npm run lint
npx tsc --noEmit
```

## Configuração (sem dados inventados)

Tudo o que é comercial vem de `.env.local` (ver `.env.example`) e de `src/config/site.ts`:

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Apenas dígitos, com DDI+DDD. Ativa botões de WhatsApp, checkout da sacola e formulário de contato. Vazio → aparece "WhatsApp em configuração". |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_STORE_LOCATION`, `NEXT_PUBLIC_STORE_HOURS` | Exibidos na seção Contato somente se preenchidos. |
| `NEXT_PUBLIC_LEGAL_NAME`, `NEXT_PUBLIC_CNPJ` | Rodapé. |
| `NEXT_PUBLIC_SITE_URL` | SEO / Open Graph. |

- **Catálogo:** `src/data/catalog.ts`. Itens atuais são de **demonstração** (`demo: true`, `price: null` → "Preço sob consulta"). Substitua por dados reais mantendo o formato; `image` aceita qualquer caminho em `public/`.
- **Políticas:** `src/data/policies.ts` + `src/app/politicas/[slug]` — páginas com aviso "em elaboração" até a loja fornecer os textos.
- **Identidade visual:** o Instagram não pôde ser acessado (bloqueio de robôs), então a marca usa uma proposta neutra premium. Cores em `src/app/globals.css` (`:root`), wordmark provisório em `src/components/layout/Logo.tsx` (troque pelo SVG oficial).

## A animação principal

### Por que canvas e não `video.currentTime`

O MP4 (1280×720, 24 fps, 10 s, 240 frames) tem **apenas 3 keyframes**. Cada seek obriga o decoder a voltar até o keyframe anterior (até ~4 s de vídeo), o que gera travadas visíveis no scrub, principalmente ao rolar para cima e no Safari. Por isso a sequência é renderizada em `<canvas>` a partir de frames WebP pré-extraídos.

### Frames (`scripts/prepare-sequence.py`)

```bash
python3 scripts/prepare-sequence.py caminho/do/video.mp4   # requer ffmpeg + Pillow
```

- **desktop:** 240 frames 1280×720 (~3,3 MB no total)
- **mobile (retrato < 768 px):** 120 frames, recorte central 640×720 (~1,3 MB) — ~4× menos memória
- **stills:** quadros para a versão `prefers-reduced-motion`, imagens institucionais e Open Graph

A partir do frame ~160 o vídeo original traz uma **interface de site gerada por IA gravada na imagem** (logo, menu com textos ilegíveis e barra branca). O script aplica um "push-in" suave (frames 148–162) que deixa esses elementos fora do quadro; no palco, o canvas é reduzido na mesma proporção (`bakedZoomCompensation` em `src/lib/sequence.ts`) — o aparelho mantém o tamanho do vídeo original e as bordas se dissolvem no fundo. Se trocar o vídeo, ajuste/remova `RAMP_*` no script e `ZOOM_RAMP` no TS.

### Arquitetura

| Arquivo | Papel |
| --- | --- |
| `src/lib/sequence.ts` | Conjuntos de frames, momentos narrativos, mapa tempo → frame (ease-out no dobrável) |
| `src/lib/frame-sequence.ts` | Carregador progressivo: frame 0 → 1/32 → 1/16 … → todos; `prioritize()` em scroll rápido; nunca exibe "buraco" (usa o frame pronto mais próximo) |
| `src/animations/evolutionTimeline.ts` | Uma única timeline GSAP (duração 1) com `scrub`: frame, textos, trilho de progresso, fundo do palco e a "abertura de luz" final |
| `src/components/evolution/ScrollEvolution.tsx` | Canvas + poster, `gsap.matchMedia` (desktop × mobile), ResizeObserver, limpeza completa |
| `src/components/evolution/EvolutionOverlay.tsx` | Estrutura tipográfica (hero, 4 momentos, trilho) |
| `src/components/evolution/ReducedMotionEvolution.tsx` | Mesma narrativa em quadros estáticos |

**Decisões:**
- **Pin:** o palco usa `position: sticky` dentro de uma seção alta e o ScrollTrigger cuida apenas do progresso (`scrub`). É o pin nativo do navegador: sem pin-spacer, sem reflow e sem o tremor que o pin via `transform/fixed` causa no scroll por inércia do iOS.
- **Sem salto visual:** poster (`<picture>`, frame 0 do conjunto certo, `fetchpriority=high`) e canvas usam o mesmo retângulo calculado só em CSS (`.evolution-frame`), então a troca é imperceptível e não há layout shift.
- **Memória:** backing do canvas limitado à resolução do frame (não adianta passar disso), `alpha: false`, decodificação via `img.decode()` fora do desenho; conexões lentas/`saveData` reduzem a concorrência de download.
- **Mobile:** `100svh`, `ScrollTrigger.config({ ignoreMobileResize: true })`, scrub mais curto em telas de toque, textos na faixa inferior.
- **Acessibilidade:** `prefers-reduced-motion` troca a sequência por quadros estáticos; skip-link; diálogos com `aria-modal`, Esc e retorno de foco.

Comprimento do scroll: `--evolution-length` em `globals.css` (560svh desktop / 480svh mobile). Janelas dos textos: `MOMENTS` em `src/lib/sequence.ts`.

## Estrutura

```
src/
  app/            layout, home, /produtos, /produtos/[categoria], /politicas/[slug], 404
  animations/     registro do GSAP e timeline da evolução
  components/
    evolution/    ScrollEvolution, EvolutionOverlay, ReducedMotionEvolution
    home/         BrandReveal, Categories, FeaturedProducts, AboutRaycell, ContactSection
    product/      ProductCard, ProductDialog, ProductVisual, ProductGrid, CatalogShell
    bag/          BagProvider (sacola com localStorage) e BagDrawer (checkout via WhatsApp)
    layout/       Header, Footer, Logo
    ui/           Reveal (reveal/parallax/zoom via ScrollTrigger), ícones
  config/ data/ hooks/ lib/
scripts/prepare-sequence.py
```

## Observações

- Apple, iPhone, Apple Watch e AirPods são marcas da Apple Inc. As imagens de produto atuais vêm do vídeo fornecido ou são ilustrações vetoriais genéricas — substitua por fotos reais do estoque.
- O dobrável é sinalizado no site como **conceitual, meramente ilustrativo e não disponível para venda**, e não aparece no catálogo.
