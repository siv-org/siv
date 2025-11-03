import { motion } from 'framer-motion'
import { BookOpen, CircleUserRound, QrCode } from 'lucide-react'
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
    className={`rounded-2xl p-6 md:p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.2)] bg-white/70 dark:bg-zinc-900/60 backdrop-blur ${className}`}
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
    <Section>
      <div className="grid gap-10 items-center lg:grid-cols-2">
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Zero‑trust digital voting</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-300">
            Everyone can verify whether an election was free & fair—
            <br />
            no advanced tech skills needed. Built to withstand nation‑state attacks.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <BlackButton href="https://siv.org" icon={QrCode} id="demo">
              Live Demo
            </BlackButton>
            <WhiteButton href="https://siv.org/whitepaper" icon={BookOpen}>
              Learn more
            </WhiteButton>
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
                <div className="flex justify-center items-center mx-auto w-12 h-12">
                  {f.icon ? (
                    <f.icon className="w-8 h-8" />
                  ) : (
                    <Image alt="" className="object-contain w-12 h-12" height={48} src={f.image} width={48} />
                  )}
                </div>
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
