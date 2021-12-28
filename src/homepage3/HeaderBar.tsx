import Image from 'next/image'

import { darkBlue } from './colors'

export const HeaderBar = () => (
  <header>
    <h3>SIV</h3>
    <span>
      <a href="/faq">FAQ</a>
      <a href="/protocol">Protocol</a>
      <a href="/about">Research</a>
      <a href="/admin">
        Sign In
        <div className="blue-underline">
          <Image layout="fill" src="/home3/blue-underline.png" />
        </div>
      </a>
    </span>
    <style jsx>{`
      header {
        display: flex;
        justify-content: space-between;
        padding-top: 2vw;
      }

      h3 {
        margin: 0;
        color: ${darkBlue};
        font-size: 3vw;
      }

      a {
        color: ${darkBlue};
        text-decoration: none;
        padding: 0 1.5vw;
        margin: 0 0.4vw;
        font-size: 2vw;
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }

      a:last-child {
        margin-left: 4vw;
        position: relative;
      }

      a:last-child:hover {
        text-decoration: none;
        filter: drop-shadow(0 0 7px #0003);
      }

      .blue-underline {
        width: 12vw;
        height: 6vw;
        position: absolute;
        right: -1vw;
        left: -1vw;
        top: 0;
        z-index: -10;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        header {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h3 {
          font-size: 8vw;
          margin-bottom: 3vw;
        }

        a {
          font-size: 4vw;
        }

        .blue-underline {
          width: 20vw;
          height: 10vw;
          top: 1vw;
        }
      }
    `}</style>
  </header>
)
