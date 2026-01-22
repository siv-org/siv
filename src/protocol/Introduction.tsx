import Image from 'next/image'
import Link from 'next/link'

import logo from './siv-logo.png'

export const Introduction = () => {
  return (
    <div style={{ padding: '10px 30px' }}>
      <Link href="/" legacyBehavior>
        <a className="logo-container">
          <Image alt="SIV Logo" fill src={logo} style={{ objectFit: 'contain' }} />
        </a>
      </Link>

      <h1 style={{ fontSize: 21, fontWeight: 700, marginBottom: 0, opacity: 0.9 }}>Secure Internet Voting Protocol</h1>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>
        Voting Option with Mathematically Provable Privacy &amp; Vote Verifiability
      </h2>

      <h3 style={{ fontWeight: 400, marginBottom: 0, marginTop: 30 }}>A secure election has three requirements:</h3>
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
          <h4>Verifiable tallies</h4>
          <p>For widely accepted results, vote totals must be independently auditable for accuracy.</p>
        </div>
      </div>

      <br />
      <p>
        There have already been digital systems in widespread use that offer each of these properties individually. Yet
        accomplishing all three at the same time has been unusually challenging.
      </p>

      <h3 style={{ fontWeight: 400, marginBottom: 0, marginTop: 35 }}>Here is how SIV meets all three requirements:</h3>

      <style jsx>{`
        .logo-container {
          width: 40px;
          height: 40px;
          margin: 20px 0;
          display: block;
          position: relative;
          transition: 0.05s opacity linear;
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
