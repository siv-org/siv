const crypto = [
  {
    history: `First described in 1991 by Dr. Torben Pryds Pedersen, Computer Science Department, Aarhus University, Denmark

Based upon Paul Feldman Verifiable Secret Sharing Scheme from 1991, MIT Computer Science & Artificial Intelligence Laboratory

Based upon Adi Shamir How to Share a Secret from 1979, Turing Award Winner, Weizmann Institute and Massachusetts Institute of Technology

Based upon the Interpolation Method discovered by Joseph-Louis Lagrange, 1795, the French Academy of Sciences.`,

    tech: `Decentralized Threshold Key Generation & Decryption`,
  },

  {
    history: `Dr. Taher Elgamal, Stanford University (MS, PhD), "A public key cryptosystem and a signature scheme based on discrete logarithms,"  1985

built on Martin Hellman, Stanford University

built on Ralph Merkle, Singularity University & Georgia Institute of Technology`,
    tech: `Dicrete Logarithm Encryption`,
  },

  {
    history: `as described by Dr. Andrew Neff, VoteHere Inc `,
    tech: `Mixnet built upon Verifiable Cryptographic Shuffle`,
  },
]

const technologies = `• WebCrypto RNG
• V8-fast javascript

Other helpful technologies:
• JSBI, from Stanford
• React, from Facebook
• Typescript, from Microsoft`

export const BuiltUponResearch = () => (
  <>
    <h2>Powering SIV</h2>
    <p>
      {crypto.map(({ history, tech }, index) => (
        <div key={index}>
          <h4>{tech}</h4>
          <p>{history}</p>
        </div>
      ))}
    </p>
    <h3>Technologies Used</h3>
    <p>{technologies}</p>
    <style jsx>{`
      p {
        white-space: pre-wrap;
      }

      h2 {
        font-size: calc(2.16vw + 1rem);
      }

      h4 {
        font-size: calc(0.24vw + 1rem);
      }
    `}</style>
  </>
)
