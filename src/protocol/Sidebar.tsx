import Link from 'next/link'

import { useScrollContext } from './scroll-context'
import { steps } from './steps'

export const Sidebar = () => {
  const { state } = useScrollContext()

  return (
    <div>
      <Link href="/">
        <h2>SIV</h2>
      </Link>
      <h3>Contents</h3>

      {steps.map((step) =>
        typeof step === 'string' ? (
          <p key={step}>{step}</p>
        ) : (
          <a
            className={state.current === step.name ? 'current' : ''}
            key={step.name}
            onClick={() => {
              const $Protocol = document.getElementById('protocol') as HTMLElement
              const offset = state[step.name]
              $Protocol.scrollTop = Number(offset)
            }}
          >
            {step.name}
          </a>
        ),
      )}

      <style jsx>{`
        div {
          min-width: 190px;
          padding: 0px 13px;
          background-color: #e5eafd;
          border-right: 1px solid rgba(0, 0, 0, 0.3);
        }

        h2 {
          cursor: pointer;
          width: 43px;
          color: rgba(0, 0, 0, 0.75);
          transition: 0.05s opacity linear;
        }

        h2:hover {
          color: rgba(0, 0, 0, 0.95);
        }

        h3 {
          opacity: 0.75;
          font-size: 15px;
        }

        p {
          opacity: 0.6;
          cursor: default;
        }

        a {
          display: block;
          padding: 3px 5px;
          border-radius: 5px;
          margin: 4px 0;
          font-weight: 500;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.6);
          transition: 0.05s color linear;
        }

        a:hover {
          color: rgba(0, 0, 0, 0.9);
          background-color: rgba(0, 0, 0, 0.04);
          text-decoration: none;
        }

        a.current {
          background-color: rgba(11, 11, 73, 0.2);
        }

        /* Hide for small screens */
        @media (max-width: 1030px) {
          div {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
