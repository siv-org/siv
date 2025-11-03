import { motion } from 'framer-motion'
import { BadgeCheck, BookOpen, Lock, QrCode, Shield } from 'lucide-react'
import React from 'react'

// Simple container
const Section = ({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section className={`relative py-16 md:py-24 ${className}`} id={id}>
    <div className="container px-4 mx-auto max-w-7xl">{children}</div>
  </section>
)

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl p-6 md:p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.2)] bg-white/70 dark:bg-zinc-900/60 backdrop-blur ${className}`}
  >
    {children}
  </div>
)

const features = [
  { desc: 'Designed to withstand nation‑state attacks', icon: Shield, title: 'Zero‑trust digital voting' },
  {
    desc: 'Anyone can verify whether an election was conducted fairly',
    icon: BadgeCheck,
    title: 'Voter‑verifiable results',
  },
  { desc: 'Strong encryption with private selections', icon: Lock, title: 'Cryptographic privacy' },
]

export const Hero = () => {
  return (
    <Section>
      <div className="grid gap-10 items-center lg:grid-cols-2">
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Zero‑trust digital voting</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-300">
            Everyone can verify whether an election was conducted fairly. Built to withstand nation‑state attacks.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              className="inline-flex gap-2 items-center px-5 py-3 text-sm font-medium text-white rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90"
              href="https://siv.org"
              id="demo"
            >
              <QrCode className="w-4 h-4" /> Live Demo
            </a>
            <a
              className="inline-flex gap-2 items-center px-5 py-3 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              href="https://siv.org/whitepaper"
            >
              <BookOpen className="w-4 h-4" /> Learn more
            </a>
          </div>
          <div className="flex gap-6 items-center mt-6">
            <div className="text-3xl font-extrabold md:text-4xl">30,000+</div>
            <div className="text-zinc-600 dark:text-zinc-300">
              votes cast in binding elections, including for a US Member of Congress
            </div>
          </div>
        </motion.div>
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.6 }}>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((f, i) => (
              <Card className="text-center" key={i}>
                <f.icon className="mx-auto w-8 h-8" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{f.desc}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
