export function ExpandableHex({ expanded, onToggle, value }: { expanded: boolean; onToggle: () => void; value: string }) {
  const short = `${value.slice(0, 12)}…`
  return (
    <button
      className="block max-w-full whitespace-normal break-all text-left font-mono26 text-[0.7rem] text-h26-textSecondary underline-offset-2 hover:text-h26-text hover:underline"
      onClick={onToggle}
      title={expanded ? 'Click to truncate' : 'Click to show full'}
      type="button"
    >
      {expanded ? value : short}
    </button>
  )
}
