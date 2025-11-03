import { motion } from 'framer-motion'
import { CircleUserRound, ListTodo, QrCode } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { BlackButton, WhiteButton } from './Buttons'

// Simple container
const Section = ({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section className={`relative py-16 md:py-24 ${className}`} id={id}>
    <div className="container px-4 mx-auto max-w-7xl">{children}</div>
  </section>
)

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl p-6 md:p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.15)] bg-gradient-to-br from-white/90 via-white/80 to-zinc-50/90 dark:from-zinc-900/80 dark:via-zinc-900/70 dark:to-zinc-950/90 backdrop-blur-md border border-white/50 dark:border-zinc-800/50 transition-all duration-300 hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.2)] hover:scale-[1.02] ${className}`}
  >
    {children}
  </div>
)

const features = [
  {
    desc: 'Only eligible registered voters can vote, and only once.',
    icon: CircleUserRound,
    title: 'One Person, One Vote',
  },
  {
    desc: 'Vote from own device, without needing to install anything.',
    image: '/homepage2025/devices.png',
    title: 'Vote in Seconds',
  },
  {
    desc: 'No one can see how you vote, incl. servers & election admins.',
    image: '/homepage2025/privacy.png',
    title: 'Cryptographic Privacy',
  },
]

export const Hero = () => {
  return (
    <Section className="overflow-hidden relative">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none from-indigo-50/40 via-violet-50/20 dark:from-indigo-950/20 dark:via-violet-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent pointer-events-none from-white/60 dark:from-zinc-950/60" />

      {/* Subtle animated background elements */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br rounded-full blur-3xl pointer-events-none from-indigo-200/30 to-violet-200/20 dark:from-indigo-900/20 dark:to-violet-900/10" />
      <div className="absolute bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr rounded-full blur-3xl pointer-events-none from-blue-200/30 to-indigo-200/20 dark:from-blue-900/20 dark:to-indigo-900/10" />

      <div className="grid relative gap-10 items-center lg:grid-cols-2">
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl bg-gradient-to-r from-[#060067] via-[#1a0a8c] to-[#060067] bg-clip-text text-transparent tracking-tight leading-[1.15] pb-0.5 md:text-6xl md:leading-[1.15] dark:from-indigo-400 dark:via-violet-300 dark:to-indigo-400">
            Zero‑trust digital voting
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed md:text-xl text-zinc-700 dark:text-zinc-300">
            Everyone can verify whether an election was free & fair—
            <br />
            no advanced tech skills needed. Built to withstand nation‑state attacks.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <BlackButton href="https://siv.org/login" icon={ListTodo} id="demo">
              Create Election
            </BlackButton>
            <WhiteButton href="https://siv.org/login" icon={QrCode}>
              Live Demo
            </WhiteButton>
          </div>
          <div className="flex gap-6 items-center mt-6">
            <div className="text-3xl font-extrabold bg-gradient-to-r from-[#060067] to-indigo-700 bg-clip-text text-transparent md:text-4xl dark:from-indigo-400 dark:to-violet-300">
              30,000+
            </div>
            <div className="text-zinc-700 dark:text-zinc-300">
              votes cast in binding elections, including for a US Member of Congress
            </div>
          </div>
        </motion.div>
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.6 }}>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((f, i) => (
              <Card className="text-center" key={i}>
                <div className="flex justify-center items-center mx-auto w-12 h-12">
                  {f.icon ? (
                    <f.icon className="w-8 h-8" />
                  ) : (
                    <Image alt="" className="object-contain w-12 h-12" height={48} src={f.image} width={48} />
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.desc}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
