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
      <div>
        <Image height={1080} layout="responsive" src="/home3/verifiability-1.png" width={1920} />
      </div>
      <div>
        <Image height={1080} layout="responsive" src="/home3/verifiability-2.png" width={1920} />
      </div>
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

      .container > div {
        position: relative;
        width: 49%;
      }
    `}</style>
  </section>
)
