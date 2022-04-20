import lagrange from './cover-photos/1795 Polynomial Interpolation Method by Joseph-Louis Lagrange.png'
import diffie_hellman from './cover-photos/1976 New Directions in Cryptography by Dr. Martin Hellman and Dr. Whitfield Diffie.png'
import merkle from './cover-photos/1978 Secure communications over insecure channels by Dr. Ralph Merkle.png'
import shamir from './cover-photos/1979 How to Share a Secret by Dr. Adi Shamir.png'
import elgamal from './cover-photos/1985 A public key cryptosystem and a signature scheme based on discrete logarithms by Dr. Taher Elgamal.jpg'
import fiat_shamir from './cover-photos/1986 How To Prove Yourself Practical Solutions to Identification and Signature Problems by Dr. Amos Fiat and Dr. Adi Shamir.png'
import feldman from './cover-photos/1991 Verifiable Secret Sharing Scheme by Dr. Paul Feldman.png'
import pedersen from './cover-photos/1992 Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing by Dr. Torben Pedersen.png'
import neff from './cover-photos/2001 A Verifiable Secret Shuffle and its Application to E-Voting by Dr. Andrew Neff.png'

export const research = [
  {
    group: `Decentralized Threshold Key Generation & Decryption`,
    papers: [
      {
        authors: ['Joseph-Louis Lagrange'],
        cover: lagrange,
        name: 'Polynomial Interpolation Method',
        year: 1795,
      },
      {
        authors: ['Dr. Adi Shamir'],
        cover: shamir,
        name: 'How to Share a Secret',
        year: 1979,
      },
      {
        authors: ['Dr. Paul Feldman'],
        cover: feldman,
        name: 'Verifiable Secret Sharing Scheme',
        year: 1991,
      },
      {
        authors: ['Dr. Torben Pedersen'],
        cover: pedersen,
        name: 'Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing',
        year: 1992,
      },
    ],
  },

  {
    group: `Discrete Logarithm Encryption`,
    papers: [
      {
        authors: ['Dr. Martin Hellman', 'Dr. Whitfield Diffie'],
        cover: diffie_hellman,
        name: 'New Directions in Cryptography',
        year: 1976,
      },
      {
        authors: ['Dr. Ralph Merkle'],
        cover: merkle,
        name: 'Secure communications over insecure channels',
        year: 1978,
      },
      {
        authors: ['Dr. Taher Elgamal'],
        cover: elgamal,
        name: 'A public key cryptosystem and a signature scheme based on discrete logarithms',
        year: 1985,
      },
    ],
  },

  {
    group: `Anonymization Mixnet`,
    papers: [
      {
        authors: ['Dr. Amos Fiat', 'Dr. Adi Shamir'],
        cover: fiat_shamir,
        name: 'How To Prove Yourself: Practical Solutions to Identification and Signature Problems',
        year: 1986,
      },
      {
        authors: ['Dr. Andrew Neff'],
        cover: neff,
        name: 'A Verifiable Secret Shuffle and its Application to E-Voting',
        year: 2001,
      },
    ],
  },
]

// const research_v1 = [
//   {
//     history: `First described in 1992's "Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing" by Dr. Torben Pedersen, Aarhus University, Denmark

// Built upon 1991's "Verifiable Secret Sharing Scheme" by Dr. Paul Feldman, MIT Computer Science & Artificial Intelligence Laboratory

// Built upon 1979's "How to Share a Secret" by Dr. Adi Shamir, Turing Award Winner, Weizmann Institute and Massachusetts Institute of Technology

// Built upon the 1795 Polynomial Interpolation Method discovered by Joseph-Louis Lagrange, the French Academy of Sciences.`,

//     tech: `Decentralized Threshold Key Generation & Decryption`,
//   },

//   {
//     history: `Based on 1985's "A public key cryptosystem and a signature scheme based on discrete logarithms" by Dr. Taher Elgamal, Stanford University

// Built upon 1978's "Secure communications over insecure channels" by Dr. Ralph Merkle, University of California Berkeley & Georgia Institute of Technology

// Built upon 1976's "New Directions in Cryptography" by Dr. Martin Hellman and Dr. Whitfield Diffie, Stanford University.`,
//     tech: `Discrete Logarithm Encryption`,
//   },

//   {
//     history: `Based on 2001's "A Verifiable Secret Shuffle and its Application to E-Voting" by Dr. Andrew Neff, Princeton University.

// Improved by 1986's "How To Prove Yourself: Practical Solutions to Identification and Signature Problems" by Dr. Amos Fiat, Tel Aviv University, and Dr. Adi Shamir, Weizmann Institute and Massachusetts Institute of Technology`,
//     tech: `Anonymization Mixnet`,
//   },
// ]
