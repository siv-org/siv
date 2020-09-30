const crypto = [
  {
    history: `First described in 1991 by Dr. Torben Pryds Pedersen, Computer Science Department, Aarhus University, Denmark

Built upon 1991's "Verifiable Secret Sharing Scheme" by Dr. Paul Feldman, MIT Computer Science & Artificial Intelligence Laboratory

Built upon 1979's "How to Share a Secret" by Dr. Adi Shamir, Turing Award Winner, Weizmann Institute and Massachusetts Institute of Technology

Built upon the 1795 Polynomial Interpolation Method discovered by Joseph-Louis Lagrange, the French Academy of Sciences.`,

    tech: `Decentralized Threshold Key Generation & Decryption`,
  },

  {
    history: `Based on 1985's "A public key cryptosystem and a signature scheme based on discrete logarithms" by Dr. Taher Elgamal, Stanford University (MS, PhD)

Built upon 1978's "Secure communications over insecure channels" by Dr. Ralph C Merkle, University of California Berkeley & Georgia Institute of Technology

Built upon 1976's "New Directions in Cryptography" by Dr. Martin Hellman and Dr. Whitfield Diffie, Stanford University.`,
    tech: `Dicrete Logarithm Encryption`,
  },

  {
    history: `Based on the 2004 Verifiable Cryptographic Shuffle, as described by Dr. Andrew Neff.`,
    tech: `Anonymization Mixnet`,
  },
]

export const BuiltUponResearch = () => (
  <>
    <h1>Powering SIV</h1>
    <div>
      {crypto.map(({ history, tech }, index) => (
        <div key={index}>
          <h4>{tech}</h4>
          <p>{history}</p>
        </div>
      ))}
    </div>
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
