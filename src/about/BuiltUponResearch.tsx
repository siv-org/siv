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
    history: `Verifiable Cryptographic Shuffle, as described by Dr. Andrew Neff`,
    tech: `Anonymization Mixnet`,
  },
]

export const BuiltUponResearch = () => (
  <>
    <h1>Powering SIV</h1>
    <p>
      {crypto.map(({ history, tech }, index) => (
        <div key={index}>
          <h4>{tech}</h4>
          <p>{history}</p>
        </div>
      ))}
    </p>
    <br />
    <h2>Technologies Used</h2>
    <p>
      <b>1:</b> WebCrypto RNG
      <br />
      <b>2:</b> V8-fast Javascript <br />
      <br />
      Other helpful technologies: <br />
      <b>3:</b> JSBI, from Stanford <br />
      <b>4:</b> React, from Facebook <br />
      <b>5:</b> Typescript, from Microsoft
    </p>
    <style jsx>{`
      p {
        white-space: pre-wrap;
      }
    `}</style>
  </>
)
