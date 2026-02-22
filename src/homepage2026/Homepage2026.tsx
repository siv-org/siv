import { useCallback, useEffect, useState } from 'react'

import { homepage2026FontClass } from './fonts'
import { ChatSection } from './ChatSection'
import { Hero } from './Hero'
import { Modal } from './Modal'
import type { ModalVariant } from './modalContent'
import { Nav } from './Nav'
import { NewsSection } from './NewsSection'

export function Homepage2026() {
  const [modalVariant, setModalVariant] = useState<ModalVariant | null>(null)
  const openModal = useCallback((v: ModalVariant) => setModalVariant(v), [])
  const closeModal = useCallback(() => setModalVariant(null), [])

  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = prev
    }
  }, [])

  return (
    <div className={`min-h-screen overflow-x-hidden bg-h2026-bg text-h2026-text antialiased ${homepage2026FontClass}`}>
      {/* Ambient orbs */}
      <div
        className="pointer-events-none fixed z-0 h-[600px] w-[600px] rounded-full opacity-45 blur-[120px] animate-orb-1"
        style={{
          top: -200,
          right: -100,
          background: 'radial-gradient(circle, rgba(37,99,235,0.07), transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none fixed z-0 h-[500px] w-[500px] rounded-full opacity-45 blur-[120px] animate-orb-2"
        style={{
          bottom: '10%',
          left: -150,
          background: 'radial-gradient(circle, rgba(251,191,36,0.05), transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <Nav />
        <Hero onWordClick={openModal} />
        <NewsSection />
        <div className="mx-auto max-w-[1060px] px-7">
          <div className="my-5 h-px bg-h2026-border md:my-10" />
        </div>
        <ChatSection />
        <footer className="border-t border-h2026-border py-7 text-center">
          <div className="mx-auto max-w-[1060px] px-7">
            <p className="text-[0.75rem] font-light text-h2026-muted">© 2026 SIV. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <Modal variant={modalVariant} onClose={closeModal} />
    </div>
  )
}
