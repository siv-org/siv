type SwitchProps = {
  checked: boolean
  label: string
  onClick: () => void
}

export function ToggleSwitch({ checked, label, onClick }: SwitchProps) {
  return (
    <button
      aria-pressed={checked}
      className="inline-flex items-center gap-2 rounded-full border border-h2026-border bg-white/70 px-3 py-1 text-[0.78rem] font-medium text-h2026-textSecondary shadow-[0_1px_3px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all hover:border-h2026-green/70 hover:text-h2026-text"
      onClick={onClick}
      type="button"
    >
      <span className="inline-flex relative items-center w-7 h-4 rounded-full bg-h2026-border/70">
        <span
          className={`inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-3.5' : 'translate-x-0.5'
          }`}
        />
      </span>
      <span>{label}</span>
    </button>
  )
}
