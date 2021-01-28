import { useReducer, useState } from 'react'

import { use_stored_info } from '../load-existing'

export const ExistingVoters = () => {
  const { voters } = use_stored_info()
  const [mask_tokens, toggle_tokens] = useReducer((state) => !state, true)
  const [checked, set_checked] = useState(new Array(voters?.length).fill(false))

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(event) => {
                  const new_checked = [...checked]
                  new_checked.fill(event.target.checked)
                  set_checked(new_checked)
                }}
              />
            </th>
            <th>#</th>
            <th>email</th>
            <th className="auth-header" onClick={toggle_tokens}>
              {mask_tokens ? 'masked' : 'full'}
              <br />
              auth token
            </th>
            <th>voted</th>
          </tr>
        </thead>
        <tbody>
          {voters?.map(({ auth_token, email, has_voted }, index) => (
            <tr key={email}>
              <td>
                <input
                  checked={checked[index]}
                  type="checkbox"
                  onChange={() => {
                    const new_checked = [...checked]
                    new_checked[index] = !checked[index]
                    set_checked(new_checked)
                  }}
                />
              </td>
              <td>{index + 1}</td>
              <td>{email}</td>
              <td style={{ fontFamily: 'monospace' }}>{mask_tokens ? mask(auth_token) : auth_token}</td>
              <td>{has_voted}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        a {
          cursor: pointer;
        }

        table {
          border-collapse: collapse;
          display: block;
          overflow: scroll;
        }

        th,
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
        }

        th {
          background: #f9f9f9;
          font-size: 11px;
        }

        .auth-header:hover {
          cursor: pointer;
          background-color: #f2f2f2;
        }
      `}</style>
    </>
  )
}

const mask = (string: string) => `${string.slice(0, 2)}......${string.slice(-2)}`
