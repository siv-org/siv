import steps from './steps'

export const Sidebar = () => (
  <div>
    <h2>SIV</h2>
    <h3>Contents</h3>
    <a>Prep Steps</a>

    {steps.map((step) => (
      <a key={step.name}>{step.name}</a>
    ))}

    <style jsx>{`
      div {
        min-width: 190px;
        padding: 0px 15px;
        background-color: #e5eafd;
        border-right: 1px solid rgba(0, 0, 0, 0.3);
      }

      a {
        display: block;
        margin: 10px 0;
        font-weight: 500;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.6);
        transition: 0.05s color linear;
      }

      a:hover {
        color: rgba(0, 0, 0, 0.9);
        text-decoration: none;
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
