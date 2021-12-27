import { darkBlue } from './colors'

export const Verifiability = () => (
  <section>
    <h2>Powerful Election Verifiability</h2>
    <p>
      Unlike paper elections, SIV gives voters the ability to personally confirm their
      <br /> own submission is counted correctly, and recount all results themselves.
    </p>
    <div>
      <img src="/home3/verifiability-1.png" width="371px" />
      <img src="/home3/verifiability-2.png" width="371px" />
    </div>
    <style jsx>{`
      section {
        margin: 3rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      h2 {
        text-align: center;
        color: ${darkBlue};
        font-size: 30px;
        font-weight: 800;
        margin-bottom: 0;
      }

      p {
        font-size: 19px;
        font-weight: 600;
        margin-bottom: 2.5rem;
      }
    `}</style>
  </section>
)
