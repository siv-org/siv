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

      <h4>I. Authenticated voters</h4>
      <p>Only registered voters are allowed to vote, once each.</p>

      <h4>II. Private voting</h4>
      <p>
        A &ldquo;Free and Fair Election&rdquo; requires that voters can make their selections without anyone else
        learning how they voted.
      </p>

      <h4>III. Independently verifiable tallies</h4>
      <p>For widely accepted results, the final vote totals must be fully auditable for accuracy.</p>

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

        h4 {
          opacity: 0.9;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}
