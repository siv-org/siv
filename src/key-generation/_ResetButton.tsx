import { api } from '../api-helper'
import { State } from './keygen-state'
export function ResetButton({ state }: { state: State }) {
  // Only show for 'dsernst.com' trustees
  if (!state.own_email.endsWith('dsernst.com')) {
    return <></>
  }

  return (
    <div
      onClick={() => {
        api(`election/${state.election_id}/keygen/reset`, {
          email: state.own_email,
          trustee_auth: state.trustee_auth,
        })
      }}
    >
      Reset
      <style jsx>
        {`
          div {
            border: 1px solid #999;
            border-radius: 4px;
            padding: 2px 10px;
            display: inline-block;
            position: fixed;
            right: 10px;
            top: 15px;
            background-color: white;
            z-index: 10;
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
            opacity: 0.5;
          }

          div:hover {
            cursor: pointer;
            opacity: 1;
          }
        `}
      </style>
    </div>
  )
}
