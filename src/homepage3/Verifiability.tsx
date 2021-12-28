import Image from 'next/image'

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
    `}</style>
  </section>
)

const Screenshot = ({ n }: { n: 1 | 2 }) => (
  <div>
    <span>{n}</span>
    <Image height={516} layout="responsive" src={`/home3/verifiability-${n}.png`} width={992} />
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
    `}</style>
  </div>
)
