export function ExploreGroup({ children, title }: { children: React.ReactNode; title: string }) {
  // Temporarily hide Safeguards sections while retaining their content and interactions.
  if (title === 'Safeguards') return null

  return (
    <section aria-label={title} className="mt-6">
      <h3 className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">{title}</h3>
      {children}
    </section>
  )
}

export function ExploreSection({ children, className = 'mt-6' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-t border-black/[0.07] pt-5 ${className}`}>
      {children}
    </div>
  )
}

export function ExploreTopic({
  attack = false,
  className = '',
  onClick,
  open,
  subtitle,
  title,
}: {
  attack?: boolean
  className?: string
  onClick: () => void
  open: boolean
  subtitle: string
  title: string
}) {
  const colors = attack
    ? open
      ? 'border-red-300 bg-red-50/60'
      : 'border-black/10 hover:border-red-200 hover:bg-red-50/30'
    : open
    ? 'border-h26-green/40 bg-h26-green/[0.06]'
    : 'border-black/10 hover:border-h26-green/30 hover:bg-h26-green/[0.03]'

  return (
    <button
      aria-expanded={open}
      className={`rounded-xl border px-4 py-3 text-left transition-colors ${colors} ${className}`}
      onClick={onClick}
      type="button"
    >
      <span className="block text-[0.82rem] font-medium text-h26-text">{title}</span>
      <span className="mt-1 block text-[0.72rem] text-h26-textSecondary">{subtitle}</span>
    </button>
  )
}
