import Image from 'next/image'
import Link from 'next/link'
import blueUnderline from 'public/home3/blue-underline.png'

import { darkBlue } from './colors'

export const HeaderBar = () => (
  <header>
    <h3>
      <Link href="/">
        <a className="logo">SIV</a>
      </Link>
    </h3>
    <nav>
      <Link href="https://docs.siv.org">
        <a>Docs</a>
      </Link>
      <Link href="https://blog.siv.org">
        <a>Blog</a>
      </Link>
      <Link href="/faq">
        <a>FAQ</a>
      </Link>
      <Link href="/about">
        <a>Research</a>
      </Link>
      <Link href="/admin">
        <a>Sign In</a>
      </Link>
    </nav>
    <style jsx>{`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
        position: relative;
      }

      h3 {
        margin: 0;
      }

      nav {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      a.logo {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: -0.5px;
        transition: transform 0.2s ease;
      }

      a.logo:hover {
        transform: scale(1.05);
      }

      a {
        color: ${darkBlue};
        text-decoration: none;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 8px;
        transition: all 0.2s ease;
        position: relative;
      }

      a:not(.logo) {
        font-weight: 500;
      }

      a:not(.logo):hover {
        background: rgba(0, 0, 0, 0.05);
        transform: translateY(-1px);
      }


      @media (max-width: 768px) {
        header {
          flex-direction: column;
          padding: 1rem;
          gap: 1rem;
        }

        nav {
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }

        a.logo {
          font-size: 1.75rem;
        }

        a {
          font-size: 0.9rem;
          padding: 0.4rem 0.8rem;
        }


      @media (max-width: 480px) {
        nav {
          flex-direction: column;
          width: 100%;
        }

        a {
          width: 100%;
          text-align: center;
        }
      }
    `}</style>
  </header>
)
