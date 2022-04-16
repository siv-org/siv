import Image from 'next/image'

import logo from './siv-logo.png'

export const Introduction = () => {
  return (
    <div style={{ padding: '10px 30px' }}>
      <div className="logo-container">
        <Image src={logo} />
      </div>

      <h1 style={{ fontSize: 21, fontWeight: 700, marginBottom: 0 }}>Secure Internet Voting Protocol</h1>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>
        Voting Method with mathematically provable privacy &amp; vote verifiability
      </h2>

      <p>There are three pillars that define a secure election:</p>
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
        There have been digital systems in widespread use for decades that accomplish each of these properties
        individually, but getting all three simultaneously is unsually challenging.
      </p>

      <p>Here&apos;s how SIV meets all three goals:</p>

      <style jsx>{`
        .logo-container {
          width: 40px;
          margin: 20px 0;
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
