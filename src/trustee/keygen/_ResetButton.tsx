import { api } from '../../api-helper'
import { State } from '../trustee-state'
export function ResetButton({ state }: { state: State }) {
  // Only show for 'dsernst.com' trustees
  if (!state.own_email.endsWith('dsernst.com')) {
    return <></>
  }

  return (
    <div
      onClick={() => {
        api(`election/${state.election_id}/trustees/reset-keygen`, {
          auth: state.auth,
          email: state.own_email,
        })
      }}
    >
      Reset
      <style jsx>
        {`
          div {
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 0, 0, 0.3);
            border-radius: 4px;
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
            display: inline-block;
            font-size: 12px;
            opacity: 0.3;
            padding: 2px 6px;
            position: fixed;
            right: 10px;
            top: 15px;
            z-index: 10;
          }

          div:hover {
            background-color: white;
            cursor: pointer;
            opacity: 1;
          }
        `}
      </style>
    </div>
  )
}
