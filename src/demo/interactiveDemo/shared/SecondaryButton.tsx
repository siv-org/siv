export function SecondaryButton({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick: () => void
}) {
  return (
    <button
      className={`inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-4 py-3 text-[0.85rem] font-medium text-h26-textSecondary no-underline transition-colors hover:border-h26-green/40 hover:bg-h26-green/[0.06] hover:text-h26-green sm:w-auto ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}
