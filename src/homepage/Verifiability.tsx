import Image from 'next/image'
import verifiability1 from 'public/home3/verifiability-1.png'
import verifiability2 from 'public/home3/verifiability-2.png'

import { darkBlue } from './colors'

export const Verifiability = () => (
  <section>
    <h2>Powerful Election Verifiability</h2>
    <p>
      Unlike paper elections, SIV gives voters the ability to personally confirm their
      <br /> own submission is counted correctly, and recount all results themselves.
    </p>
    <div className="container">
      <Screenshot n={1} />
      <Screenshot n={2} />
    </div>
    <style jsx>{`
      section {
        margin: 8vw 0 15vw;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      h2 {
        text-align: center;
        color: ${darkBlue};
        font-size: 3.75vw;
        font-weight: 800;
        margin-bottom: 0;
      }

      p {
        font-size: 2.375vw;
        font-weight: 600;
        margin-bottom: 5vw;
      }

      .container {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        h2 {
          font-size: 6vw;
        }

        p {
          font-size: 4.5vw;
          text-align: center;
          margin-bottom: 13vw;
        }

        p br {
          display: none;
        }

        .container {
          flex-direction: column;
        }
      }
    `}</style>
  </section>
)

const images = { 1: verifiability1, 2: verifiability2 }

const Screenshot = ({ n }: { n: 1 | 2 }) => (
  <div>
    <span>{n}</span>
    <Image height={516} layout="responsive" placeholder="blur" src={images[n]} width={992} />
    <style jsx>{`
      div {
        position: relative;
        width: 47%;

        box-shadow: rgba(0, 0, 0, 0.24) 0px 0.375vw 1vw;
      }

      span {
        position: absolute;
        top: -1.4vw;
        left: -1.4vw;
        background: #fff;
        border-radius: 10vw;

        border: 0.25vw solid ${darkBlue};
        width: 2.8vw;
        height: 2.8vw;
        z-index: 10;
        text-align: center;

        font-size: 1.6vw;
        font-weight: 700;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        div {
          width: 100%;
          margin-bottom: 10vw;
          box-shadow: rgba(0, 0, 0, 0.24) 0px 0.7vw 2vw;
        }

        span {
          font-size: 4vw;
          width: 6vw;
          height: 6vw;
          top: -3vw;
          left: -3vw;
        }
      }
    `}</style>
  </div>
)
