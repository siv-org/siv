import type { OpenedModalIndex } from './compare-data'

type ModalContent = {
  advantages: string
  d_name: string
  disadvantages: string
  title: string
}

type Props = {
  bountyEnabled: boolean
  modalContent: ModalContent | null
  openedModalIndex: OpenedModalIndex
  closeModal: () => void
  goLeft: () => void
  goRight: () => void
}

export function CompareModal({
  bountyEnabled,
  modalContent,
  openedModalIndex,
  closeModal,
  goLeft,
  goRight,
}: Props) {
  if (!modalContent || !openedModalIndex) return null

  return (
    <div
      className="flex fixed inset-0 z-40 justify-center items-center px-4 py-8 bg-slate-900/60"
      onClick={closeModal}
    >
      <div
        className="relative max-h-[80vh] w-full max-w-[640px] overflow-y-auto rounded-2xl border border-white/10 bg-h2026-bg px-6 py-6 text-left shadow-[0_24px_80px_rgba(15,23,42,0.65)] md:px-8 md:py-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close comparison details"
          className="absolute top-4 right-4 p-1 rounded-full transition-colors text-h2026-muted hover:bg-white/5 hover:text-h2026-text"
          onClick={closeModal}
          type="button"
        >
          <span className="block w-4 h-4">
            <span className="absolute h-[1px] w-4 rotate-45 bg-current" />
            <span className="absolute h-[1px] w-4 -rotate-45 bg-current" />
          </span>
        </button>

        <div className="flex gap-3 justify-between items-center pr-7">
          <div className="space-y-1">
            <p className="font-mono2026 text-[0.7rem] uppercase tracking-[0.18em] text-h2026-muted">Explanation</p>
            <h3 className="font-serif2026 text-[1.1rem] font-normal leading-[1.4] tracking-tight text-h2026-text">
              {modalContent.title}
            </h3>
          </div>
        </div>

        <div className="mt-5 text-[0.85rem] leading-[1.7] text-h2026-textSecondary">
          <div className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-emerald-700">Advantages</div>
          {modalContent.advantages
            .split('\n')
            .map((c) => c.trim())
            .filter((c) => c)
            .map((advantage, index) => (
              <div className="flex gap-2 mb-2" key={`adv-${index.toString()}`}>
                <span className="mt-[1px] text-[1.1rem] font-bold text-emerald-600">+</span>
                <span>{advantage}</span>
              </div>
            ))}

          <div className="mt-5 mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-rose-700">
            Disadvantages
          </div>
          {modalContent.disadvantages
            .split('\n')
            .map((c) => c.trim())
            .filter((c) => c)
            .map((disadvantage, index) => (
              <div className="flex gap-2 mb-2" key={`disadv-${index.toString()}`}>
                <span className="mt-[1px] text-[1.1rem] font-bold text-rose-600">–</span>
                <span>{disadvantage}</span>
              </div>
            ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 text-[0.78rem] text-h2026-muted">
          <div className="flex gap-3">
            <button
              className="rounded-full border border-h2026-border bg-white/5 px-3 py-1.5 text-[0.76rem] font-medium text-h2026-textSecondary shadow-sm transition-colors hover:border-h2026-green/70 hover:text-h2026-text"
              onClick={goLeft}
              type="button"
            >
              ← Previous
            </button>
            <button
              className="rounded-full border border-h2026-border bg-white/5 px-3 py-1.5 text-[0.76rem] font-medium text-h2026-textSecondary shadow-sm transition-colors hover:border-h2026-green/70 hover:text-h2026-text"
              onClick={goRight}
              type="button"
            >
              Next →
            </button>
          </div>
          <span>Use arrow keys to move across cells</span>
        </div>
      </div>
    </div>
  )
}
