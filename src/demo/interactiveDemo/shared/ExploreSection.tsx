export function ExploreSection({ children, className = 'mt-6' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-t border-black/[0.07] pt-5 ${className}`}>{children}</div>
}

export function ExploreTopic({
  className = '',
  onClick,
  open,
  subtitle,
  title,
}: {
  className?: string
  onClick: () => void
  open: boolean
  subtitle: string
  title: string
}) {
  const colors = open
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
