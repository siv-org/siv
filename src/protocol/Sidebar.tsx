import { useScrollContext } from './ScrollContext'
import { stepHash } from './step-hash'
import { groupedSteps } from './steps'

export const Sidebar = () => {
  const { state } = useScrollContext()

  return (
    <div className="sidebar">
      <h3>Contents</h3>

      {groupedSteps.map(({ group, steps }) => (
        <div className="steps" key={group}>
          <p>{group}</p>
          {steps.map((step) => (
            <a
              className={state.current === step.name ? 'current' : ''}
              href={`#${stepHash[step.name]}`}
              key={step.name}
              onClick={(event) => {
                event.preventDefault()

                const $Protocol = document.getElementById('protocol') as HTMLElement
                const offset = state[step.name]
                $Protocol.scrollTop = Number(offset) - 30
              }}
            >
              {step.name}
            </a>
          ))}
        </div>
      ))}

      <style jsx>{`
        .sidebar {
          min-width: 190px;
          padding: 0px 13px;
          background: linear-gradient(90deg, #05112f 0%, #0a1c47 100%);
          color: #fffb;
          height: 100vh;
        }

        h3 {
          margin-top: 2rem;
          opacity: 0.75;
          font-size: 15px;
        }

        p {
          opacity: 0.6;
          cursor: default;
        }

        .steps a {
          display: block;
          padding: 3px 8px;
          border-radius: 5px;
          margin: 4px 0;
          font-weight: 500;
          cursor: pointer;
          color: #fffa;
          transition: 0.05s color linear;
          text-decoration: none;
        }

        .steps a:hover {
          color: #fffe;
          background-color: #ffffff18;
        }

        .steps a.current {
          background-color: #ffffff28;
        }

        /* Hide for small screens */
        @media (max-width: 1030px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
