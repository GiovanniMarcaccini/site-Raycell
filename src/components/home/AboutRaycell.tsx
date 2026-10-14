import Image from "next/image";
import { Gem, MessagesSquare, ShieldCheck } from "lucide-react";
import { Reveal } from "../ui/Reveal";

/*
 * Texto institucional de posicionamento (sem números, prazos ou garantias
 * específicas — esses dados devem vir da loja).
 */
const PILLARS = [
  {
    icon: Gem,
    title: "Curadoria",
    body: "Produtos escolhidos com critério, para quem valoriza design e tecnologia.",
  },
  {
    icon: MessagesSquare,
    title: "Atendimento próximo",
    body: "Conversa direta para tirar dúvidas, comparar modelos e decidir com segurança.",
  },
  {
    icon: ShieldCheck,
    title: "Compra transparente",
    body: "Condições, procedência e disponibilidade informadas com clareza antes da compra.",
  },
];

export function AboutRaycell() {
  return (
    <Reveal as="section" id="sobre" aria-labelledby="sobre-title" className="overflow-hidden bg-surface py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#d2d3d5] lg:order-1">
          <div data-parallax="6" className="absolute -inset-y-[8%] inset-x-0">
            <Image
              src="/sequence/stills/f112.webp"
              alt="iPhone apresentado em estúdio de luz natural"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p data-reveal className="eyebrow">
            Sobre a Raycell
          </p>
          <h2 data-reveal id="sobre-title" className="display mt-4 text-[clamp(2.2rem,4.4vw,3.75rem)]">
            Tecnologia que se escolhe com calma. E se vive com intensidade.
          </h2>
          <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2">
            A Raycell Imports nasceu para aproximar você dos dispositivos que definem a nossa época — com uma experiência
            de compra à altura deles.
          </p>

          <ul className="mt-12 grid gap-8 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <li data-reveal key={title}>
                <span className="grid size-11 place-items-center rounded-full border border-line-strong bg-white">
                  <Icon className="size-[1.1rem]" strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
