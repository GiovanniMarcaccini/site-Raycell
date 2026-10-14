/** Ícone genérico de balão de conversa com telefone (Lucide não inclui marcas). */
export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.6l-4.5.9z" />
      <path d="M9 8.6c.2-.5.5-.6.9-.6h.4c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.4c0 .4-.2.7-.6.9-.6.3-1.4.4-2.3 0a8.7 8.7 0 0 1-4.3-4.3c-.4-.9-.3-1.7 0-2.5z" />
    </svg>
  );
}
