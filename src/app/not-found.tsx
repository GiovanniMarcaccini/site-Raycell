import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="display mt-4 text-5xl">Página não encontrada.</h1>
      <p className="mt-4 text-ink-2">O conteúdo que você procura não existe ou mudou de endereço.</p>
      <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-white">
        Voltar ao início
      </Link>
    </section>
  );
}
