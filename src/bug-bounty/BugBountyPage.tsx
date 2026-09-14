import { Bug, ChevronRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'
import { useAnalytics } from 'src/useAnalytics'

import { h26fonts } from '../homepage2026/fonts'
import { Footer } from '../homepage2026/Footer'
import { Nav } from '../homepage2026/Nav'

type Severity = 'critical' | 'high' | 'info' | 'low' | 'medium'

const SEVERITY: Record<Severity, { color: string; label: string }> = {
  critical: { color: '#9b1c1c', label: 'Critical' },
  high: { color: '#c2410c', label: 'High' },
  info: { color: '#718096', label: 'Info' },
  low: { color: '#2b6cb0', label: 'Low' },
  medium: { color: '#b7791f', label: 'Medium' },
}

const BOUNTIES: { amount: string; meaning: string; sev: Severity }[] = [
  { amount: '$10,000', meaning: 'Undetectably changes the outcome or breaks vote secrecy at scale.', sev: 'critical' },
  { amount: '$2,500', meaning: 'Changes or blocks votes, but is caught during a post-election audit.', sev: 'high' },
  {
    amount: '$500',
    meaning: 'Caught before the voting period ends, or affects a limited set of voters.',
    sev: 'medium',
  },
  {
    amount: '$100',
    meaning: 'Caught at time of voting by system alerts, or degrades the experience without affecting results.',
    sev: 'low',
  },
  { amount: '$25', meaning: 'Cosmetic errors, unclear docs, typos.', sev: 'info' },
]

const THREATS: { heading: string; note?: string; rows: { sev: Severity; text: string }[] }[] = [
  {
    heading: 'Eligibility & authentication',
    rows: [
      {
        sev: 'critical',
        text: 'A person casts more than one vote, or submits multiple votes through different vote-casting methods, and it is never detected.',
      },
      {
        sev: 'critical',
        text: 'Postal mail providers act maliciously or make errors (using or discarding auth codes, not sending invitations, skipping certain areas) and it is never detected.',
      },
      {
        sev: 'critical',
        text: "A voter's credentials are lost or stolen and used, and it is never detected.",
      },
      {
        sev: 'critical',
        text: 'The state voter file has accidental inaccuracies or malicious changes, and it is never detected.',
      },
      {
        sev: 'critical',
        text: 'Someone collects discarded credentials (a voter throws the invitation away, someone else picks it up and votes) and it is never detected.',
      },
      { sev: 'high', text: 'Any of the above, detected only after results are posted, during audit.' },
      { sev: 'medium', text: 'Any of the above, detected before the voting period ends.' },
      { sev: 'medium', text: "A voter can't reach their mail (travelling, delivery delays) and has no way to vote." },
      { sev: 'low', text: 'Duplicate votes detected at time of voting by system alerts and de-duplication.' },
    ],
  },
  {
    heading: 'Verifiable results & individual votes',
    note: 'This section is about outcomes, not every possible attack path.',
    rows: [
      {
        sev: 'critical',
        text: "A vote is changed from the voter's intent by server cheating, and it is undetectable.",
      },
      {
        sev: 'critical',
        text: 'A vote is changed by on-device malware tampering locally before submission, and it is undetectable.',
      },
      {
        sev: 'critical',
        text: 'A vote is changed during cryptographic shuffling for anonymization, and it is undetectable.',
      },
      {
        sev: 'critical',
        text: 'Votes are lost undetectably: the administrator secretly invalidates voters, the server loses cast votes, or an attacker omits specific votes from the tally.',
      },
      {
        sev: 'critical',
        text: 'Illegitimate votes are added undetectably, e.g. the administrator or another attacker adds fake voters.',
      },
      { sev: 'critical', text: 'Miscounted results are published or tallying errors occur, undetectably.' },
      { sev: 'critical', text: 'Malicious software compromises the uniqueness of Verification #s, undetectably.' },
      { sev: 'high', text: 'Any of the above, where the change is detectable by the voter or the public audit.' },
      { sev: 'high', text: 'Post-election audit sampling is maliciously corrupted.' },
      { sev: 'medium', text: 'Post-election audit sampling is miscalculated or performed incorrectly.' },
    ],
  },
  {
    heading: 'Privacy',
    rows: [
      { sev: 'critical', text: 'The privacy design can be backdoored to leak private keys to a central location.' },
      {
        sev: 'critical',
        text: 'A feasible way to break the cryptography, to learn (and possibly leak) how people voted.',
      },
      { sev: 'critical', text: 'The server learns how one or more voters voted.' },
      { sev: 'critical', text: 'The election administrator learns how one or more voters voted.' },
      {
        sev: 'high',
        text: 'A voter is coerced to vote a certain way (physical threats, employment, social reputation) and the system offers no defense.',
      },
      { sev: 'medium', text: 'Traffic analysis reveals voting patterns.' },
      {
        sev: 'medium',
        text: 'Side-channel or screen-scraping attacks extract voter choices or keys via sensors, hidden cameras, or screen capture.',
      },
      { sev: 'medium', text: 'A voter wants to cast a secret vote override, but the data needed to do so is lost.' },
    ],
  },
  {
    heading: 'Dispute resolution',
    rows: [
      {
        sev: 'high',
        text: 'A voter truthfully reports their vote is missing or miscounted, and it cannot be resolved.',
      },
      { sev: 'medium', text: 'Voters lose the verification data needed to check their vote.' },
      { sev: 'medium', text: 'Malicious actors flood support claiming "missing votes," overwhelming voter support.' },
      {
        sev: 'low',
        text: "A voter falsely reports their vote is missing or miscounted, and the system can't disprove it.",
      },
      {
        sev: 'low',
        text: "Non-voters make false claims about illegitimate results to spread doubt, and the system can't disprove them.",
      },
    ],
  },
  {
    heading: 'Availability',
    rows: [
      { sev: 'critical', text: 'Key material needed to decrypt votes and tally results is lost.' },
      {
        sev: 'high',
        text: 'The vote server or another part of the stack intentionally censors certain voters, via connection issues or other methods.',
      },
      {
        sev: 'high',
        text: 'An attack (e.g. DDoS) on the server or infrastructure makes voting inaccessible to everyone.',
      },
      { sev: 'medium', text: 'Local internet providers block connections to the voting website.' },
    ],
  },
  {
    heading: 'Accessibility',
    rows: [
      { sev: 'medium', text: 'Inaccessible design: missing screen-reader, high-contrast, or vision-support features.' },
      { sev: 'low', text: 'Unclear voting instructions cause voter confusion.' },
      { sev: 'low', text: "Voters don't have ballots in their own language." },
    ],
  },
]

const LAYERS: { body: string[]; numeral: string; question: string }[] = [
  {
    body: [
      'For decades, many have proposed ways to vote online. Some sacrifice privacy for verifiability. Others maintain strong privacy and verifiability but set aside coercion and vote selling.',
      'We have been working to answer the hardest challenges the academic community has raised over the years, and achieve one person/one vote, end-to-end verifiable results, while maintaining vote contents private.',
      'We therefore invite all democracy stakeholders (e.g., election administrators, democracy innovators, security engineers) to review our threat model and report weaknesses in how we think about the threats.',
    ],
    numeral: 'I',
    question: 'Do we agree on the threat model itself?',
  },
  {
    body: [
      'At this stage, we value vulnerabilities in the SIV protocol most. If the protocol has critical flaws, it does not matter how well we implement it in code.',
    ],
    numeral: 'II',
    question: 'Do we agree the SIV protocol addresses the threat model?',
  },
  {
    body: [
      'SIV is being used to elect State Senators, members of Congress, party leaders, government leaders, board members, and to decide multi-million-dollar questions.',
      'We care greatly about vulnerabilities in how we wrote the program. We also greatly value when you see solutions to the weaknesses identified. To that end, the SIV source code is public.',
    ],
    numeral: 'III',
    question: 'Do we agree the codebase implements the protocol well?',
  },
]

function SevLabel({ sev }: { sev: Severity }) {
  const { color, label } = SEVERITY[sev]
  return (
    <span className="inline-flex gap-2 items-center whitespace-nowrap">
      <span className="size-[0.55em] rounded-full shrink-0" style={{ background: color }} />
      <span className="font-mono26 text-[0.68rem] uppercase tracking-[0.12em]">{label}</span>
    </span>
  )
}

const card = 'rounded-[18px] border border-h26-border bg-white/70 overflow-hidden'
const table = 'w-full text-left text-[0.88rem] leading-[1.5]'
const rowBorder = 'border-b border-h26-border last:border-0'

export function BugBountyPage({ activeFor, lastUpdated }: { activeFor: string; lastUpdated: string }) {
  useAnalytics()

  return (
    <div className={`overflow-x-hidden min-h-screen antialiased bg-h26-bg text-h26-text ${h26fonts}`}>
      <Head
        description="SIV bug bounties for the National Election Threat Model (US President): what we defend against, what we pay, and how to report."
        title="Bug Bounty"
      />

      <Nav />

      {/* Header */}
      <section className="px-7 pt-[120px] pb-8 md:pt-[150px] md:pb-10 mx-auto max-w-[760px] animate-[fadeInUp_0.8s_ease_both]">
        <p className="font-mono26 mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-h26-muted mt-5">
          <Bug size={16} />
          SIV Security
        </p>
        <h1 className="font-serif26 text-[clamp(1.2rem,3.6vw,2rem)] font-normal leading-[1.15] tracking-tight mt-8 mb-3 whitespace-nowrap">
          Continuous Disclosure Program
        </h1>
        <p className="text-[0.92rem] leading-[1.7] text-h26-textSecondary">
          Active for {activeFor}. Last updated {lastUpdated}.
        </p>
      </section>

      <main className="px-7 pb-20 md:pb-28 mx-auto max-w-[760px] text-[0.92rem] leading-[1.7] text-h26-text">
        <p className="mb-4 animate-[fadeInUp_0.8s_0.1s_ease_both]">
          SIV can be used in many types of elections, but at its core, SIV was built to serve as an additional voting
          option in the most adversarial environments, with the ultimate goal of enabling better high-scale digital
          democracy. So, to hold ourselves to the highest standard, this disclosure program&apos;s threat model is a
          national election (e.g., the US presidential election), where adversaries are nation-states willing to spend
          military-sized budgets for any available advantage; alongside party insiders, election officials, software and
          hardware providers, the SIV team itself, voters themselves, artificial general intelligence agents, and anyone
          with a computer and hacking skills.
        </p>
        <p className="mb-8 animate-[fadeInUp_0.8s_0.15s_ease_both]">
          Here is how we think about structuring the Continuous Disclosure Program:
        </p>

        {/* Three questions we want answered */}
        <div className="mb-10 animate-[fadeInUp_0.8s_0.2s_ease_both]">
          {LAYERS.map(({ body, numeral, question }) => (
            <details className="border-t group border-h26-border last:border-b" key={numeral}>
              <summary className="flex items-center gap-2 py-4 cursor-pointer list-none font-serif26 text-[1.05rem] tracking-tight">
                <ChevronRight
                  aria-hidden
                  className="transition-transform size-4 shrink-0 text-h26-muted group-open:rotate-90"
                />
                <span>
                  {numeral}. {question}
                </span>
              </summary>
              <div className="pb-5 pl-5">
                {body.map((paragraph) => (
                  <p className="mb-2.5 last:mb-0 text-h26-textSecondary" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>

        {/* Guiding principle */}
        <p className="mb-3 animate-[fadeInUp_0.8s_0.25s_ease_both]">
          Overall, one principle guided how we think about and build for high scale digital democracy: we do not assume
          systems will not be broken into. With enough resources, anything can be broken into. We do follow the highest
          security practices, while also balancing security with usability. But above all, we design for evidence, for
          zero trust: if something goes bad, everyone, especially voters, can personally check whether their votes and
          the election results were changed. Tamper evident. Then, be able to remediate each compromised vote, instead
          of having to invalidate the entire election.
        </p>

        <p className="mb-12 text-h26-textSecondary animate-[fadeInUp_0.8s_0.3s_ease_both]">
          <strong className="font-medium text-h26-text">
            So the question we value most: can results be changed, dropped, or fabricated without anyone noticing? Can
            you compromise integrity, availability, or vote confidentiality without anyone noticing — especially the
            voters?
          </strong>
        </p>

        {/* Bounties */}
        <h2 className="font-serif26 text-[clamp(1.35rem,3vw,1.75rem)] tracking-tight mb-5">Bounties</h2>
        <div className={`mb-3 divide-y ${card} sm:hidden divide-h26-border`}>
          {BOUNTIES.map(({ amount, meaning, sev }) => (
            <div className="px-4 py-3.5" key={sev}>
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <SevLabel sev={sev} />
                <span className="font-mono26 text-[0.82rem]">{amount}</span>
              </div>
              <p className="text-[0.85rem] text-h26-textSecondary leading-[1.5]">{meaning}</p>
            </div>
          ))}
        </div>
        <div className={`hidden mb-3 ${card} sm:block`}>
          <table className={table}>
            <thead>
              <tr className="border-b border-h26-text/20">
                <th className="px-5 py-3.5 font-medium w-[7.5rem]">Severity</th>
                <th className="px-3 py-3.5 font-medium w-[6.5rem] whitespace-nowrap">Bounty</th>
                <th className="px-5 py-3.5 pr-6 font-medium">What it means</th>
              </tr>
            </thead>
            <tbody>
              {BOUNTIES.map(({ amount, meaning, sev }) => (
                <tr className={rowBorder} key={sev}>
                  <td className="px-5 py-3.5 align-top">
                    <SevLabel sev={sev} />
                  </td>
                  <td className="px-3 py-3.5 align-top font-mono26 text-[0.82rem] whitespace-nowrap">{amount}</td>
                  <td className="px-5 py-3.5 pr-6 align-top text-h26-textSecondary">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mb-14 text-[0.82rem] text-h26-muted">
          A bug&apos;s severity is set by the worst outcome it enables in the threat model below, not by how clever the
          technique is.
        </p>

        {/* Assumptions */}
        <h2 className="font-serif26 text-[clamp(1.35rem,3vw,1.75rem)] tracking-tight mb-4">Assumptions</h2>
        <p className="mb-3 text-h26-textSecondary">
          The threat model assumes the following about how a national election would be run on SIV:
        </p>
        <ol className="pl-5 mb-14 space-y-2 list-decimal text-h26-textSecondary">
          <li>The election administrator is a central authority responsible for the voter roll.</li>
          <li>
            Voters receive their invitation to vote by postal mail. It contains a unique, single-use Auth Code the voter
            uses to authenticate and cast their vote.
          </li>
          <li>
            The election administrator may require additional authentication methods, such as a signature, Social
            Security number, or photo ID.
          </li>
        </ol>

        {/* Out of scope */}
        <h2 className="font-serif26 text-[clamp(1.35rem,3vw,1.75rem)] tracking-tight mb-4">Out of scope</h2>
        <p className="mb-3 text-h26-textSecondary">
          We are not defending against these, and reports about them do not qualify:
        </p>
        <ul className="pl-5 mb-14 space-y-2 list-disc text-h26-textSecondary">
          <li>
            <strong className="font-medium text-h26-text">{"Spyware on the voter's device "}</strong>
            that learns how the person votes.
          </li>
          <li>
            <strong className="font-medium text-h26-text">{'Accuracy of the voter roll '}</strong>
            itself. Eligibility is the election administrator&apos;s responsibility.
          </li>
          <li>
            <strong className="font-medium text-h26-text">{'Phishing attacks '}</strong>
            against voters.
          </li>
        </ul>

        {/* In scope */}
        <h2 className="font-serif26 text-[clamp(1.35rem,3vw,1.75rem)] tracking-tight mb-3">In scope</h2>
        <p className="mb-10 text-h26-textSecondary">
          Every row below is a bad outcome we are defending against. Find a way to cause one, and the bounty is the
          row&apos;s severity.
        </p>

        {THREATS.map(({ heading, note, rows }) => (
          <div className="mb-10" key={heading}>
            <h3 className="font-serif26 text-[1.08rem] tracking-tight mb-3">{heading}</h3>
            {note && <p className="mb-3 text-[0.82rem] text-h26-muted">{note}</p>}
            <div className={card}>
              <table className={table}>
                <tbody>
                  {rows.map(({ sev, text }) => (
                    <tr className={rowBorder} key={text}>
                      <td className="px-3 py-3 sm:px-5 sm:py-3.5 align-top w-[6.5rem] sm:w-[7.5rem]">
                        <SevLabel sev={sev} />
                      </td>
                      <td className="px-3 py-3 pr-4 sm:px-5 sm:py-3.5 sm:pr-6 align-top text-h26-textSecondary">
                        {text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Reporting */}
        <div
          className="mt-16 mb-14 rounded-[24px] bg-h26-green/[0.06] px-6 py-10 md:px-10 md:py-12"
          style={{ boxShadow: '0 4px 20px -8px rgba(26,107,74,0.12), 0 0 0 1px rgba(26,107,74,0.04)' }}
        >
          <h2 className="font-serif26 text-[clamp(1.35rem,3vw,1.75rem)] tracking-tight mb-4">Reporting a bug</h2>
          <p className="mb-4 text-h26-textSecondary">
            Email{' '}
            <a
              className="font-medium underline text-h26-text decoration-h26-border underline-offset-2 hover:decoration-h26-text"
              href="mailto:security@siv.org"
            >
              security@siv.org
            </a>{' '}
            with <strong className="font-medium text-h26-text">{'"bug bounty" '}</strong>
            in the subject line. Include how to reproduce it and which threat above it maps to. If it&apos;s not a
            security flaw, a{' '}
            <a
              className="font-medium underline text-h26-text decoration-h26-border underline-offset-2 hover:decoration-h26-text"
              href="https://github.com/siv-org/siv/issues"
              rel="noreferrer"
              target="_blank"
            >
              GitHub issue
            </a>{' '}
            on the SIV repository is fine too.
          </p>
          <p className="mb-4 text-h26-textSecondary">
            Please don&apos;t run automated vulnerability scanners against the production site. They&apos;re noisy and
            don&apos;t produce useful reports.
          </p>
          <p className="mb-8 text-h26-textSecondary">
            Tell us if you&apos;d like to remain anonymous. Otherwise, past recipients are listed publicly.
          </p>
          <a
            className="inline-flex items-center gap-2 rounded-full bg-h26-green px-6 py-3 text-[0.88rem] font-medium text-white no-underline shadow-h26-cta transition-all duration-300 hover:-translate-y-0.5 hover:bg-h26-greenHover hover:shadow-h26-cta-hover"
            href="mailto:security@siv.org?subject=bug%20bounty"
          >
            <Mail size={16} strokeWidth={2} />
            Email security@siv.org
          </a>
        </div>

        {/* Fine print */}
        <h2 className="font-serif26 text-[clamp(1.35rem,3vw,1.75rem)] tracking-tight mb-4">The fine print</h2>
        <ol className="mb-4 list-decimal pl-5 space-y-2.5 text-[0.85rem] text-h26-textSecondary">
          <li>
            A bounty is awarded only to the first person to report a bug. If two or more people report the same bug at
            about the same time, it may be split.
          </li>
          <li>The same root cause appearing in multiple places receives a single bounty.</li>
          <li>Security bugs publicly disclosed before they are fixed are not eligible.</li>
          <li>Only the discoverer of a bug is eligible. Forwarding fixes from upstream projects does not qualify.</li>
          <li>Bounties are not paid where it is illegal to do so.</li>
          <li>
            Testing must not affect real voters, real elections, or other people&apos;s data. Use the public test
            environment.
          </li>
          <li>Classifications, amounts, and conditions may change without notice.</li>
          <li>SIV has sole discretion to decide whether a report qualifies and at which severity.</li>
        </ol>
      </main>

      {/* Back to home */}
      <section className="px-7 pb-16 text-center">
        <Link
          className="inline-flex items-center gap-2 text-[0.82rem] text-h26-muted no-underline transition-colors hover:text-h26-text mb-4"
          href="/"
        >
          <span>←</span>
          Back to home
        </Link>
      </section>

      <Footer />
      <TailwindPreflight />
    </div>
  )
}
