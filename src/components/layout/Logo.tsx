import Link from "next/link";

/**
 * Wordmark tipográfico provisório.
 * A identidade oficial da Raycell Imports não estava acessível publicamente —
 * substitua este componente pelo SVG oficial do logotipo quando disponível.
 */
export function Logo({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Raycell Imports — início" className={`group inline-flex flex-col leading-none ${className}`}>
      <span className="text-[1.15rem] font-semibold tracking-[-0.04em] text-ink">Raycell</span>
      <span className="mt-[3px] flex items-center gap-1.5 text-[0.5rem] font-medium uppercase tracking-[0.42em] text-muted">
        <span className="h-px w-3 bg-gradient-to-r from-metal-2 to-metal-3 transition-all duration-500 group-hover:w-5" />
        Imports
      </span>
    </Link>
  );
}
