import { JumboBlue } from './JumboBlue'

export const WeCanDoBetter = (): JSX.Element => (
  <JumboBlue>
    <h2>WE CAN DO BETTER</h2>
    <p>
      Despite vast demand, there&apos;s only modest discussion towards <b>digital voting</b>. Most{' '}
      <a
        href="https://www.newyorker.com/tech/annals-of-technology/why-you-cant-just-vote-on-your-phone-during-the-pandemic"
        rel="noreferrer"
        target="_blank"
      >
        mainstream coverage
      </a>{' '}
      discourages it. <br />
      <br />
      Too many people have been led to believe that internet voting is impossibly insecure.
    </p>

    <style jsx>{`
      h2 {
        margin: 0;
        padding: 17px;
      }

      p {
        text-align: center;
        font-size: calc(0.72vw + 1rem);
        line-height: 1.6;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `}</style>
  </JumboBlue>
)
