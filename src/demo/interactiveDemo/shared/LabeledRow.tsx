export function LabeledRow({
  className = '',
  emphasize,
  label,
  mono,
  value,
}: {
  className?: string
  emphasize?: boolean
  label: string
  mono?: boolean
  value: string
}) {
  return (
    <div className={`px-4 py-3 rounded-xl bg-h26-bg ${className}`}>
      <div className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">{label}</div>
      <div
        className={`mt-1 break-all text-[0.85rem] ${mono ? 'font-mono26' : ''} ${
          emphasize ? 'font-medium text-h26-green' : 'text-h26-text'
        }`}
      >
        {value}
      </div>
    </div>
  )
}
