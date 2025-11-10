import Image from 'next/legacy/image'
import Link from 'next/link'

import logo from './siv-logo.png'

export const Introduction = () => {
  return (
    <div style={{ padding: '10px 30px' }}>
      <Link href="/" legacyBehavior>
        <a className="hidden float-right md:block logo-container">
          <Image src={logo} />
        </a>
      </Link>

      <h1 style={{ fontSize: 21, fontWeight: 700, marginBottom: 0, opacity: 0.9 }}>Digital Voting Process</h1>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>Senate Election</h2>
      <p className="mt-0 text-[15px]">
        In December 2025, the Utah Forward Party invites all 53,000 eligible voters to cast their vote on who should
        fill the Utah Senate District 11 vacancy. Although Forward was allowed to make the decision through a closed
        internal party vote, the group instead chose an open democratic process. For more information on this event
        visit:{' '}
        <a className="italic text-blue-500/50" href="https://11chooses.com" rel="noopener noreferrer" target="_blank">
          11chooses.com
        </a>{' '}
        or{' '}
        <a
          className="italic text-blue-500/50"
          href="https://utahforwardparty.org/open_process_20251022"
          rel="noopener noreferrer"
          target="_blank"
        >
          utahforwardparty.org/open_process_20251022.
        </a>{' '}
      </p>

      <p>
        To conduct the vote, the Utah Forward Party is partnering with the SIV.org team to use the{' '}
        <a className="text-blue-500/80" href="https://siv.org" rel="noopener noreferrer" target="_blank">
          SIV
        </a>{' '}
        digital voting platform.
      </p>

      <h3 className="mt-8 mb-0 font-bold shadow-sm">For this election, we aim to meet the following key criteria:</h3>
      <div className="pillars">
        <div className="pillar">
          <h4>Authenticated voters</h4>
          <p>Only legitimately registered voters are allowed to vote, and only once per person.</p>
        </div>

        <div className="pillar">
          <h4>Private voting</h4>
          <p>A fair election requires that voters can freely choose without anyone learning how they voted.</p>
        </div>

        <div className="pillar">
          <h4>Verifiable results</h4>
          <p>For widely accepted results, vote totals must be independently auditable for accuracy.</p>
        </div>
      </div>

      <br />

      <h3 className="mt-5 mb-0 font-bold shadow-sm">The voting process:</h3>

      <style jsx>{`
        .logo-container {
          width: 40px;
          margin: 20px 0;
          display: none;
          transition: 0.05s opacity linear;
        }

        @media (min-width: 768px) {
          .logo-container {
            display: block;
          }
        }

        .logo-container:hover {
          opacity: 0.8;
        }

        p {
          margin-top: 0;
          font-size: 15px;
        }

        h2 {
          margin-bottom: 1.5rem;
        }

        .pillars {
          display: flex;
          justify-content: space-between;
        }
        .pillar {
          text-align: left;
          width: 26%;
        }
        .pillar p {
          opacity: 0.8;
        }
        @media (max-width: 420px) {
          .pillars {
            flex-direction: column;
          }
          .pillar {
            width: 100%;
          }
        }

        h4 {
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}
