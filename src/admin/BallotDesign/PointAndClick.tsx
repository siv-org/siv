import { useEffect, useState } from 'react'
import { Item } from 'src/vote/storeElectionInfo'

import { check_for_urgent_ballot_errors } from './check_for_ballot_errors'
import { IOSSwitch } from './IOSSwitch'

export const PointAndClick = ({ design, setDesign }: { design: string; setDesign: (s: string) => void }) => {
  /* Features to support

    - [x] See current design

    - [x] Edit item title
    - [x] Edit options name
    - [x] Delete existing options
    - [x] Toggle 'Write in' allowed
    - [x] Create new options
    - [ ] Add new items
    - [ ] Delete items

    - [ ] Re-order items
    - [ ] Set item ID
    - [ ] Edit item description
    - [ ] Edit item final question ("Should this bill be")
    - [ ] Reorder existing options
    - [ ] Edit option's subline (e.g. Party affiliation)
    - [ ] Edit option's short_id (if too long)

*/
  const [json, setJson] = useState<Item[]>()

  const errors = check_for_urgent_ballot_errors(design)

  useEffect(() => {
    if (!errors) setJson(JSON.parse(design))
  }, [design])

  return (
    <div className={`ballot ${errors ? 'errors' : ''}`}>
      {json?.map(({ options, title, write_in_allowed }, questionIndex) => (
        <div key={questionIndex}>
          <label className="title-label">Question Title:</label>
          <input
            className="title-input"
            value={title}
            onChange={({ target }) => {
              const new_json = [...json]
              new_json[questionIndex].title = target.value
              setDesign(JSON.stringify(new_json, undefined, 2))
            }}
          />
          <ul>
            {options?.map(({ name }, optionIndex) => (
              <li key={optionIndex}>
                <input
                  className="name-input"
                  value={name}
                  onChange={({ target }) => {
                    const new_json = [...json]
                    new_json[questionIndex].options[optionIndex].name = target.value
                    setDesign(JSON.stringify(new_json, undefined, 2))
                  }}
                />
                <a
                  className="delete-btn"
                  onClick={() => {
                    const new_json = [...json]
                    new_json[questionIndex].options.splice(optionIndex, 1)
                    setDesign(JSON.stringify(new_json, undefined, 2))
                  }}
                >
                  ✕
                </a>
              </li>
            ))}
            <a
              className="add-option"
              onClick={() => {
                const new_json = [...json]
                new_json[questionIndex].options.push({ name: '' })
                setDesign(JSON.stringify(new_json, undefined, 2))
              }}
            >
              Add another option
            </a>
            <li className={`write-in ${write_in_allowed ? 'allowed' : 'disabled'}`}>
              <span>{`Write-in ${write_in_allowed ? 'Allowed' : 'Disabled'}`}</span>
              <IOSSwitch
                checked={write_in_allowed}
                onChange={() => {
                  const new_json = [...json]
                  new_json[questionIndex].write_in_allowed = !write_in_allowed
                  setDesign(JSON.stringify(new_json, undefined, 2))
                }}
              />
            </li>
          </ul>
        </div>
      ))}
      <style jsx>{`
        .ballot {
          flex: 1;
          border: 1px solid #ccc;
          color: #444;
          padding: 0px 10px;
        }

        .errors {
          background-color: hsl(0, 0%, 90%);
          opacity: 0.5;
          cursor: not-allowed;
        }

        .title-label {
          margin-top: 15px;
          font-style: italic;
          display: block;
          font-size: 10px;
        }

        .title-input {
          font-size: 14px;
          width: 100%;
          padding: 5px;
        }

        .name-input {
          padding: 5px;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .delete-btn {
          background: hsl(0, 0%, 42%);
          opacity: 0.5;
          border-radius: 100px;
          width: 18px;
          height: 18px;
          display: inline-block;
          text-align: center;
          color: white;
          line-height: 17px;
          padding-left: 1px;
          cursor: pointer;
          margin-left: 5px;
        }

        .delete-btn:hover {
          opacity: 1;
          text-decoration: none;
        }

        .add-option {
          font-style: italic;
          padding-left: 8px;
          margin: 3px 0 14px;
          display: block;
          font-size: 13px;
          cursor: pointer;
        }

        .write-in span {
          font-size: 13px;
          font-style: italic;
          width: 123px;
          display: inline-block;
          color: hsl(0, 0%, 17%);
          padding-left: 8px;
        }

        .write-in.disabled {
          list-style: none; /* Remove bullet */
        }

        .write-in.disabled span {
          opacity: 0.6;
        }
      `}</style>
    </div>
  )
}
