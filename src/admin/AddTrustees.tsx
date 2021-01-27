import { StageAndSetter } from './AdminPage'
import { SaveButton } from './SaveButton'

export const AddTrustees = ({ set_stage, stage }: StageAndSetter) => {
  return (
    <>
      <h3>Trustees:</h3>
      <label>Each Trustee adds an extra assurance of vote privacy.</label>
      <ol>
        <li>
          admin@secureinternetvoting.org
          <br />
          <span>The SIV server</span>
        </li>
      </ol>
      {stage === 1 && (
        <div>
          <a>+ Add another trustee</a>
          <SaveButton
            onPress={async () => {
              await new Promise((res) => setTimeout(res, 1000))
              set_stage(stage + 1)
            }}
          />
        </div>
      )}
      <style jsx>{`
        label {
          opacity: 0.5;
        }

        span {
          opacity: 0.5;
        }

        a {
          margin-left: 2.5rem;
          cursor: pointer;
        }

        div {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
      `}</style>
    </>
  )
}
