import { useEffect, useState } from 'react'

import { ReplayButton } from './ReplayButton'
import { ShufflingVotes } from './ShufflingVotes'
import { StaticPileOfVotes } from './StaticPileofVotes'

export const Mixnet = () => {
  const observers = ['SIV Server', 'David Ernst', 'Ariana Ivan']
  const [step, setStep] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setStep((v) => (v < 5 ? v + 1 : v))
    }, 1000)
  }, [])

  return (
    <section>
      <h3>Anonymization Mixnet</h3>
      <ReplayButton onClick={() => setStep(0)} />
      <main>
        <StaticPileOfVotes />
        <label>Originally Submitted Votes</label>
        {observers.map((o, index) => (
          <div key={index}>
            {step > index * 2 &&
              (step > index * 2 + 1 ? (
                <>
                  <ShufflingVotes />
                </>
              ) : (
                <>
                  <img src="/vote/shuffle.png" />
                  <p>
                    Shuffled by <b>{o}</b>
                  </p>
                </>
              ))}
          </div>
        ))}
      </main>
      <style jsx>{`
        section {
          margin-bottom: 3rem;
        }

        main {
          display: flex;
          align-items: center;
          position: relative;
        }

        label {
          position: absolute;
          bottom: -60px;
          line-height: 17px;
          width: 100px;
          text-align: center;
        }

        img {
          width: 40px;
          margin: 0 15px;
        }
      `}</style>
    </section>
  )
}
