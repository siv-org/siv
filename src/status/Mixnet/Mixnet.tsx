import { useEffect, useState } from 'react'

import { PileOfVotes } from './PileOfVotes'

export const Mixnet = () => {
  const observers = ['SIV Server', 'David Ernst', 'Ariana Ivan']
  const [step, setStep] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setStep((v) => v + 1)
    }, 1000)
  }, [])
  return (
    <section>
      <h3>Anonymization Mixnet</h3>
      <PileOfVotes />
      <div>
        <span className="votes">Votes Originally Submitted</span>
        {observers.map((o, index) => (
          <>
            {step > index * 2 && <img src="/vote/shuffle.png" />}
            {step > index * 2 + 1 && (
              <span className="votes">
                Votes shuffled by <b>{o}</b>
              </span>
            )}
          </>
        ))}
      </div>
      <style jsx>{`
        section {
          margin-bottom: 3rem;
        }

        div {
          display: flex;
          align-items: center;
        }

        .votes {
          border: 1px solid #666;
          border-radius: 3px;
          width: 80px;
          padding: 5px;
          display: inline-block;
          height: 95px;
        }

        img {
          width: 40px;
          margin: 0 15px;
        }
      `}</style>
    </section>
  )
}
