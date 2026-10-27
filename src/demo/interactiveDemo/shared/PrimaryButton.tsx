export function PrimaryButton({
  children,
  className = '',
  disabled,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`inline-flex w-full items-center justify-center rounded-full border border-h26-green/40 bg-h26-green/[0.08] px-5 py-3 text-[0.88rem] font-medium text-h26-green no-underline shadow-sm transition-colors hover:border-h26-green/70 hover:bg-h26-green/[0.14] hover:text-h26-green disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto ${className}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}
