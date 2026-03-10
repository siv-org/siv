import { ScrollReveal } from '../../homepage2026/ScrollReveal'
import { ContributorRow } from './ContributorRow'

const STAGGER_DELAY = 0.08

const contributors = [
  {
    affiliation: 'SIV.org Founder',
    focus: 'System Architecture, Security, Cryptography & Organizational Strategy',
    name: 'David Ernst',
  },
  { affiliation: 'SIV.org', focus: 'Operations & Software Engineering', name: 'Ariana Ivan' },
  { affiliation: 'MIT CSAIL', focus: 'Cryptography Algorithms & Privacy', name: 'Greg Little, PhD' },
  {
    affiliation: 'MIT',
    focus: 'Vote Selling + Coercion Resistant Algorithms & Innovative Governance Applications',
    name: 'Nathan Foss',
  },
  {
    affiliation: 'Bucharest University of Economic Studies',
    focus: 'Statistics & Post-Election Audits',
    name: 'Erica Contulov',
  },
  {
    affiliation: 'Former City Attorney of Dallas, TX',
    focus: 'Legal & Government',
    name: 'Warren Ernst',
  },
  {
    affiliation: 'PSE.dev & MACI',
    focus: 'Privacy, Vote Selling & Coercion Resistant Algorithms',
    name: 'Alessandro C',
  },
  {
    affiliation: 'CREO Cybersecurity Lab, North Carolina A&T State University',
    focus: 'US Elections Cybersecurity',
    name: 'Jason Green, PhD',
  },
  { affiliation: 'Former NASA Scientist', focus: 'Strategy', name: 'John Cumbers, PhD' },
  { affiliation: 'Colorado State University', focus: 'Government & Policy', name: 'Gino Parisi' },
  {
    affiliation: "Australia's National Science Agency, CSIRO",
    focus: 'Cybersecurity Review & Engineering',
    name: 'Chris Jackett, PhD',
  },
  { affiliation: 'Columbia University', focus: 'Funding', name: 'Eric D. Schmidt' },
  { affiliation: 'Colorado Forward Party', focus: 'Voting Methods & Engineering', name: 'Joshua Herr' },
  {
    affiliation: 'Former Department of Innovation & Technology, City of Chicago',
    focus: 'Strategy',
    name: 'Kathryn Mattie',
  },
  { affiliation: 'Amazon Web Services', focus: 'Software Engineering', name: 'Henry Wong' },
  { affiliation: 'Technology Entrepreneur, LoopRL', focus: 'Funding', name: 'Eshan Kejriwal' },
  { affiliation: 'University of California, Davis School of Law', focus: 'Legal', name: 'Max Calehuff' },
  {
    affiliation: 'Columbia University, zkFuzz',
    focus: 'Security for Verifiable Private Overrides',
    name: 'Hideaki Takahashi, PhD Candidate',
  },
]

export function Contributors() {
  return (
    <div className="px-6 m-16 mx-auto max-w-4xl">
      <div className="mb-16 text-center">
        {/* Page title */}
        <h1 className="mb-6 text-4xl font-medium tracking-tight text-gray-900">Contributors</h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600">
          Meet the people who have advanced the mission of zero-trust digital voting:
        </p>
      </div>

      {/* Contributors Table */}
      {contributors.map((c, i) => (
        <ScrollReveal delay={i * STAGGER_DELAY} key={c.name}>
          <ContributorRow affiliation={c.affiliation} focus={c.focus} name={c.name} />
        </ScrollReveal>
      ))}
    </div>
  )
}
