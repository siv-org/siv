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
    <span>
      <Link href="/hacksiv">
        <a>Hack SIV</a>
      </Link>
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
        <a>
          Sign In
          <div className="blue-underline">
            <Image layout="fill" src={blueUnderline} />
          </div>
        </a>
      </Link>
    </span>
    <style jsx>{`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 2vw;
      }

      h3 {
        margin: 0;
      }

      a.logo {
        font-size: 3vw;
      }

      a {
        color: ${darkBlue};
        text-decoration: none;
        padding: 1vw 1.5vw;
        margin: 0 0.4vw;
        font-size: 2vw;
        border-radius: 5px;
      }

      a:not(.logo) {
        font-weight: 500;
      }

      a:hover {
        background: #eee;
        text-decoration: none;
      }

      a:last-child:not(.logo) {
        margin-left: 4vw;
        position: relative;
        padding-bottom: 0.5vw;
      }

      .blue-underline {
        width: 12vw;
        height: 6vw;
        position: absolute;
        right: -1vw;
        left: -1vw;
        top: 11px;
        z-index: 10;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        header {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h3 {
          margin-bottom: 3vw;
        }

        a.logo {
          font-size: 8vw;
        }

        a {
          font-size: 3.7vw;
        }

        a:last-child:not(.logo) {
          margin-left: 0;
        }

        .blue-underline {
          width: 18vw;
          height: 10vw;
          top: 1.3vw;
        }
      }
    `}</style>
  </header>
)
