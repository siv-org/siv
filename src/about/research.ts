import lagrange from './cover-photos/1795 Polynomial Interpolation Method by Joseph-Louis Lagrange.png'
import diffie_hellman from './cover-photos/1976 New Directions in Cryptography by Dr. Martin Hellman and Dr. Whitfield Diffie.png'
import merkle from './cover-photos/1978 Secure communications over insecure channels by Dr. Ralph Merkle.png'
import shamir from './cover-photos/1979 How to Share a Secret by Dr. Adi Shamir.png'
import elgamal from './cover-photos/1985 A public key cryptosystem and a signature scheme based on discrete logarithms by Dr. Taher Elgamal.jpg'
import fiat_shamir from './cover-photos/1986 How To Prove Yourself Practical Solutions to Identification and Signature Problems by Dr. Amos Fiat and Dr. Adi Shamir.png'
import montgomery from './cover-photos/1987 Montgomery.png'
import feldman from './cover-photos/1991 Verifiable Secret Sharing Scheme by Dr. Paul Feldman.png'
import pedersen from './cover-photos/1992 Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing by Dr. Torben Pedersen.png'
import neff from './cover-photos/2001 A Verifiable Secret Shuffle and its Application to E-Voting by Dr. Andrew Neff.png'
import djb from './cover-photos/2006 curve25519.png'
import ristretto from './cover-photos/2018 ristretto.png'

export const research = [
  {
    group: `Decentralized Threshold Key Generation & Decryption`,
    papers: [
      {
        affiliation: 'The French Academy of Sciences',
        authors: ['Joseph-Louis Lagrange'],
        cover: lagrange,
        name: 'Polynomial Interpolation Method',
        year: 1795,
      },
      {
        affiliation: 'Turing Award Winner, Weizmann Institute and Massachusetts Institute of Technology',
        authors: ['Dr. Adi Shamir'],
        cover: shamir,
        name: 'How to Share a Secret',
        year: 1979,
      },
      {
        affiliation: 'MIT Computer Science & Artificial Intelligence Laboratory',
        authors: ['Dr. Paul Feldman'],
        cover: feldman,
        name: 'Verifiable Secret Sharing Scheme',
        year: 1991,
      },
      {
        affiliation: 'Aarhus University, Denmark',
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
        affiliation: 'Turing Award Winners, Stanford University',
        authors: ['Dr. Martin Hellman', 'Dr. Whitfield Diffie'],
        cover: diffie_hellman,
        name: 'New Directions in Cryptography',
        year: 1976,
      },
      {
        affiliation: 'University of California Berkeley & Georgia Institute of Technology',
        authors: ['Dr. Ralph Merkle'],
        cover: merkle,
        name: 'Secure communications over insecure channels',
        year: 1978,
      },
      {
        affiliation: 'Stanford University',
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
        affiliation: 'Tel Aviv University, Weizmann Institute of Science, and Massachusetts Institute of Technology',
        authors: ['Dr. Amos Fiat', 'Dr. Adi Shamir'],
        cover: fiat_shamir,
        name: 'How To Prove Yourself: Practical Solutions to Identification and Signature Problems',
        year: 1986,
      },
      {
        affiliation: 'Princeton University',
        authors: ['Dr. Andrew Neff'],
        cover: neff,
        name: 'A Verifiable Secret Shuffle and its Application to E-Voting',
        year: 2001,
      },
    ],
  },

  {
    group: `Elliptic Curve Cryptography`,
    papers: [
      {
        affiliation: 'University of California, Los Angeles',
        authors: ['Dr. Peter L. Montgomery'],
        cover: montgomery,
        name: 'Speeding the Pollard and Elliptic Curve Methods of Factorization',
        year: 1987,
      },
      {
        affiliation: 'University of Illinois at Chicago, Eindhoven University of Technology',
        authors: ['Dr. Daniel J. Bernstein'],
        cover: djb,
        name: 'Curve25519: new Diffie-Hellman speed records',
        year: 2006,
      },
      {
        affiliation: 'Stanford University',
        authors: ['Dr. Mike Hamburg et al.'],
        cover: ristretto,
        name: 'Ristretto 255: Prime Order Groups',
        year: 2018,
      },
    ],
  },
]
