import { useEffect } from 'react'

import { MODAL_CONTENT, type ModalVariant } from './modalContent'

type ModalProps = {
  variant: ModalVariant | null
  onClose: () => void
}

const ACCENT_CLASS: Record<ModalVariant, string> = {
  easy: 'bg-h2026-green',
  safe: 'bg-h2026-blue',
  smart: 'bg-h2026-purple',
}

const KICKER_CLASS: Record<ModalVariant, string> = {
  easy: 'text-h2026-green',
  safe: 'text-h2026-blue',
  smart: 'text-h2026-purple',
}

export function Modal({ variant, onClose }: ModalProps) {
  const isOpen = variant !== null
  const data = variant ? MODAL_CONTENT[variant] : null

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!data) return null

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-6 transition-all duration-300 ease-out ${
        isOpen
          ? 'pointer-events-auto bg-black/20 backdrop-blur-[12px]'
          : 'pointer-events-none bg-transparent backdrop-blur-none'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full max-w-[520px] overflow-hidden rounded-h2026-lg bg-white shadow-[0_30px_80px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out ${
          isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-[0.97] opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1 ${ACCENT_CLASS[variant!]}`} />
        <div className="relative px-9 pb-8 pt-9">
          <button
            type="button"
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-h2026-muted transition-colors hover:bg-black/10 hover:text-h2026-text"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          <p
            className={`font-mono2026 mb-3 text-[0.68rem] font-normal uppercase tracking-[0.15em] ${KICKER_CLASS[variant!]}`}
          >
            {data.kicker}
          </p>
          <h3 id="modal-title" className="font-serif2026 mb-4 text-2xl font-normal tracking-tight">
            {data.title}
          </h3>
          <div className="text-[0.9rem] font-light leading-[1.7] text-h2026-textSecondary [&>p]:mb-3 [&>p:last-child]:mb-0">
            {data.content}
          </div>
        </div>
      </div>
    </div>
  )
}
