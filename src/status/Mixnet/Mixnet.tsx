import { useElectionInfo } from '../use-election-info'
import { Animation } from './Animation'
import { FadeAndSlideInCSS } from './FadeAndSlideInCSS'
import { RandomPathsCSS } from './Shuffle/RandomPathsCSS'

export const debug = false

export const Mixnet = () => {
  const { observers = [] } = useElectionInfo()
  return (
    <section>
      <h3>Anonymization Mixnet</h3>
      <p>
        This animation illustrates how the encrypted votes were anonymized{' '}
        {observers.length > 1 ? "by the Election's Verifying Observers " : ''}
        before being unlocked. For more, see{' '}
        <a href="../protocol#4" target="_blank">
          SIV Protocol Step 4: Verifiable Shuffle
        </a>
        .
      </p>
      <Animation />
      <RandomPathsCSS />
      <FadeAndSlideInCSS />
      <style jsx>{`
        section {
          padding: 1rem;
          background: #fff;
          margin-bottom: 2rem;
          border-radius: 8px;

          box-shadow: 0px 2px 2px hsl(0 0% 50% / 0.333), 0px 4px 4px hsl(0 0% 50% / 0.333),
            0px 6px 6px hsl(0 0% 50% / 0.333);
        }

        h3 {
          margin: 0 0 5px;
        }

        p {
          margin-top: 0px;
          font-size: 13px;
          font-style: italic;
          opacity: 0.7;
        }

        a {
          font-weight: 600;
        }
      `}</style>
    </section>
  )
}
