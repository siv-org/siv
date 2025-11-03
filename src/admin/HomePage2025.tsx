import { motion } from 'framer-motion'
import {
  Accessibility,
  ArrowRight,
  BadgeCheck,
  BarChart2,
  BookOpen,
  CheckCircle2,
  Cpu,
  Lock,
  QrCode,
  Shield,
  Users,
  Vote,
} from 'lucide-react'
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

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3 items-start">
    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
    <span className="text-sm leading-relaxed md:text-base">{children}</span>
  </li>
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

const steps = [
  { desc: 'Eligibility + adaptable authentication', icon: Users, title: 'One Person, One Vote' },
  { desc: 'Familiar devices, click‑to‑vote UX', icon: Vote, title: 'Vote in Seconds' },
  { desc: 'Private selections, public proofs', icon: Lock, title: 'Cryptographic Privacy' },
]

const onePersonOneVote = [
  'One vote credential per eligible voter',
  'Adaptable voter authentication based on election requirements',
  'Works alongside in‑person & postal‑mail voting',
  'Invalidate & re‑issue individual voter credentials when necessary',
  'Ballot‑stuffing protection: roll can be audited by 3rd parties',
  'Reusable auth for future votes, even if admins become anti‑democratic',
]

const verifiableResults = [
  'Public tallying: anyone can recount results — instant, automatic, thousands of free recounts',
  'Personal vote verification: each voter can see their vote was cast‑as‑intended',
  'Timeless: results remain verifiable long after voting ends',
  'Admins can prove they are not cheating',
  'Servers can prove they are not cheating',
  'Open source: code inspectable by anyone',
  'Malware protection: voters can detect & remediate tampering from their own devices',
  'High‑efficiency audits: high confidence results with small samples',
  'Software‑independence: all results can be checked against paper',
  'Dispute protection: against false claims your vote was compromised',
  'Quantum‑resistance: results can’t be forged by large quantum computers',
]

const privateVoting = [
  'Strong end‑to‑end encryption',
  'Anonymized selections, not voters: admins can see who votes, not how people vote',
  'Network privacy: safe from IP deanonymization or timing correlations',
  'Easy air‑gapping: no code review needed to protect from spying clients',
  'Verifiable Private Overrides: protections against buying and coercion attacks',
]

const accessibility = [
  'Easy, point‑and‑click interface',
  'Familiar devices: phones, laptops & desktops',
  'No software installs necessary',
  'Accessibility tools for voters with vision or mobility needs',
  'Nearly‑instant voter experience, like email‑style UX',
  'Quick results: tally thousands of votes in seconds',
  'Highly resilient to network disruptions',
  'Multilingual support for hundreds of languages',
  'Free for voters: no fees, tolls, parking, or transport costs',
  'Cost savings for election admins: fewer staff, less equipment & paper',
  'Easier support for resistant voting methods (Ranked‑Choice, STAR, Approval, PB)',
]

const compareRows = [
  { label: 'Auditable voter authentication', scores: [8, 5, 7] },
  { label: 'Verifiable results', scores: [9.5, 4, 6] },
  { label: 'Vote privacy', scores: [8, 4.5, 7] },
  { label: 'Coercion resistance', scores: [9, 8, 9] },
  { label: 'Accessibility', scores: [8.5, 6.5, 5] },
  { label: 'Speed of voting', scores: [9, 7, 3] },
  { label: 'Speed of tallying', scores: [9, 3, 5] },
  { label: 'Affordability to administer', scores: [8, 5, 4] },
]

const ScorePill = ({ v }: { v: number }) => (
  <span className="inline-flex justify-center px-3 py-1 text-sm font-medium text-white rounded-full min-w-12 bg-zinc-900 dark:bg-white dark:text-zinc-900">
    {v}
  </span>
)

export const HomePage2025 = () => {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-b via-white from-zinc-50 to-zinc-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur bg-white/70 dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800">
        <div className="container flex justify-between items-center px-4 mx-auto max-w-7xl h-16">
          <div className="flex gap-3 items-center">
            <span className="font-semibold tracking-tight">SIV</span>
          </div>
          <nav className="hidden gap-6 items-center text-sm md:flex">
            <a className="hover:opacity-80" href="#how">
              How it works
            </a>
            <a className="hover:opacity-80" href="#security">
              Security
            </a>
            <a className="hover:opacity-80" href="#compare">
              Contributors
            </a>
            <a className="hover:opacity-80" href="#demo">
              Live Demo
            </a>
          </nav>
          <div className="flex gap-3 items-center">
            <a
              className="px-4 py-2 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              href="https://hack.siv.org"
            >
              Hack SIV
            </a>
            <a
              className="px-4 py-2 text-sm font-medium text-white rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90"
              href="https://siv.org/compare"
            >
              Log In
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
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

      {/* How it works */}
      <Section className="bg-gradient-to-b from-transparent to-zinc-100/60 dark:to-zinc-900/40" id="how">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">Three steps, publicly verifiable results</p>
          </div>
          <div className="grid gap-6 mt-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={i}>
                <div className="flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {i + 1}. {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{s.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Security properties */}
      <Section id="security">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <div className="flex gap-2 items-center">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold tracking-tight">One Person, One Vote</h3>
            </div>
            <ul className="grid gap-3 mt-4">
              {onePersonOneVote.map((t, i) => (
                <ListItem key={i}>{t}</ListItem>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="flex gap-2 items-center">
              <BarChart2 className="w-5 h-5" />
              <h3 className="font-semibold tracking-tight">Verifiable Results</h3>
            </div>
            <ul className="grid gap-3 mt-4">
              {verifiableResults.map((t, i) => (
                <ListItem key={i}>{t}</ListItem>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="flex gap-2 items-center">
              <Lock className="w-5 h-5" />
              <h3 className="font-semibold tracking-tight">Private Voting</h3>
            </div>
            <ul className="grid gap-3 mt-4">
              {privateVoting.map((t, i) => (
                <ListItem key={i}>{t}</ListItem>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* Accessibility & ops */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex gap-2 items-center">
              <Accessibility className="w-5 h-5" />
              <h3 className="font-semibold tracking-tight">Accessibility & Experience</h3>
            </div>
            <ul className="grid gap-3 mt-4">
              {accessibility.map((t, i) => (
                <ListItem key={i}>{t}</ListItem>
              ))}
            </ul>
          </Card>
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <Cpu className="w-5 h-5" />
                <h3 className="font-semibold tracking-tight">Open to scrutiny</h3>
              </div>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
                Open source, software‑independent checks, third‑party audits, and public recounts. Anyone can verify
                claims instead of trusting the operator.
              </p>
            </div>
            <div className="mt-6">
              <a
                className="inline-flex gap-2 items-center px-5 py-3 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:opacity-90"
                href="https://hack.siv.org"
              >
                Join the $10k Hack SIV challenge <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </Card>
        </div>
      </Section>

      {/* Comparison */}
      <Section className="bg-gradient-to-b from-transparent to-zinc-100/60 dark:to-zinc-900/40" id="compare">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">SIV vs Mail vs In‑Person</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            High‑level comparison across accuracy, privacy, and cost
          </p>
        </div>
        <div className="grid gap-4 mt-10">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-3 text-sm font-medium px-2">
            <div />
            <div className="text-center">SIV</div>
            <div className="text-center">Mail</div>
            <div className="text-center">In‑Person</div>
          </div>
          <Card>
            <div className="grid gap-4">
              {compareRows.map((row, idx) => (
                <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center gap-3" key={idx}>
                  <div className="text-sm md:text-base">{row.label}</div>
                  <div className="text-center">
                    <ScorePill v={row.scores[0]} />
                  </div>
                  <div className="text-center">
                    <ScorePill v={row.scores[1]} />
                  </div>
                  <div className="text-center">
                    <ScorePill v={row.scores[2]} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div className="mt-6 text-center">
            <a
              className="inline-flex gap-2 items-center px-5 py-3 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              href="https://siv.org/compare"
            >
              See detailed methodology
            </a>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pb-28">
        <Card className="py-12 text-center">
          <h3 className="text-2xl font-bold md:text-3xl">Run a verifiable election with SIV</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Launch a pilot, request a demo, or audit an existing election
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <a
              className="px-5 py-3 text-sm font-medium text-white rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90"
              href="https://siv.org/contact"
            >
              Talk to us
            </a>
            <a
              className="px-5 py-3 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              href="https://siv.org"
            >
              Explore the demo
            </a>
          </div>
        </Card>
      </Section>

      <footer className="py-10 text-sm text-center text-zinc-500">
        © {new Date().getFullYear()} SIV.org — Secure, verifiable, private digital voting
      </footer>
    </div>
  )
}

export default HomePage2025
