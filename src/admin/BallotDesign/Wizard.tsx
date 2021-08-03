import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Tooltip } from 'src/admin/Voters/Tooltip'
import { Item } from 'src/vote/storeElectionInfo'

import { check_for_urgent_ballot_errors } from './check_for_ballot_errors'
import { IOSSwitch } from './IOSSwitch'

export const Wizard = ({ design, setDesign }: { design: string; setDesign: (s: string) => void }) => {
  /* Features to support

    - [x] See current design

    - [x] Edit item title
    - [x] Edit options name
    - [x] Delete existing options
    - [x] Toggle 'Write in' allowed
    - [x] Create new options
    - [x] Add new questions
    - [x] Delete questions
    - [x] Set item ID

    - [ ] Edit option's subline (e.g. Party affiliation)
    - [ ] Edit item description
    - [ ] Edit item final question ("Should this bill be")
    - [ ] Re-order items
    - [ ] Reorder existing options
    - [ ] Edit option's short_id (if too long)

    - [ ] Collapse item's options
*/
  const [json, setJson] = useState<Item[]>()

  const errors = check_for_urgent_ballot_errors(design)

  useEffect(() => {
    if (!errors) setJson(JSON.parse(design))
  }, [design])

  return (
    <div className={`ballot ${errors ? 'errors' : ''}`}>
      {json?.map(({ id, options, title, write_in_allowed }, questionIndex) => (
        <div className="question" key={questionIndex}>
          <label className="id-label">
            Question ID{' '}
            <Tooltip
              placement="top"
              title={
                <span style={{ fontSize: 14 }}>
                  This unique short ID is used as the column header for the table of submitted votes.
                </span>
              }
            >
              <span className="question-id-tooltip">
                <QuestionCircleOutlined />
              </span>
            </Tooltip>
          </label>
          <div className="id-line">
            <input
              className="id-input"
              value={id}
              onChange={({ target }) => {
                const new_json = [...json]
                new_json[questionIndex].id = target.value
                setDesign(JSON.stringify(new_json, undefined, 2))
              }}
            />
            <Tooltip placement="top" title="Delete Question">
              <a
                className="delete-question-btn"
                onClick={() => {
                  const new_json = [...json]
                  new_json.splice(questionIndex, 1)
                  setDesign(JSON.stringify(new_json, undefined, 2))
                }}
              >
                <DeleteOutlined />
              </a>
            </Tooltip>
          </div>
          <label className="title-label">Question Title:</label>
          <div className="title-line">
            <input
              className="title-input"
              value={title}
              onChange={({ target }) => {
                const new_json = [...json]
                new_json[questionIndex].title = target.value
                setDesign(JSON.stringify(new_json, undefined, 2))
              }}
            />
          </div>
          <ul className="options">
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
                  className="delete-option-btn"
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
              + Add another option
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
      <a
        className="add-question"
        onClick={() => {
          const new_json = [...(json || [])]
          const new_question_number = new_json.length + 1
          new_json.push({
            id: `item${new_question_number}`,
            title: `Question ${new_question_number}`,
            // eslint-disable-next-line sort-keys-fix/sort-keys-fix
            options: [{ name: 'Option 1' }, { name: 'Option 2' }],
            write_in_allowed: false,
          })
          setDesign(JSON.stringify(new_json, undefined, 2))
        }}
      >
        + Add another question
      </a>
      <style jsx>{`
        .ballot {
          flex: 1;
          border: 1px solid #ccc;
          color: #444;
          padding: 10px;
          background: #eee;
          padding-bottom: 0;
        }

        .errors {
          background-color: hsl(0, 0%, 90%);
          opacity: 0.3;
          cursor: not-allowed;
        }

        .question {
          padding: 10px;
          background: #fff;
        }

        .question:not(:first-child) {
          margin-top: 15px;
        }

        .id-label,
        .title-label {
          margin-top: 15px;
          font-style: italic;
          display: block;
          font-size: 10px;
        }

        .question-id-tooltip {
          font-size: 12px;
          position: relative;
          left: 4px;
          top: 1px;
          color: rgb(90, 102, 233);
        }

        .id-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .title-line {
          display: flex;
          align-items: center;
        }

        .id-input,
        .title-input {
          font-size: 14px;
          padding: 5px;
        }

        .title-input {
          flex: 1;
        }

        .delete-question-btn {
          font-size: 20px;
          color: hsl(0, 0%, 28%);
          cursor: pointer;
          margin-left: 5px;
          width: 29px;
          text-align: center;
          border-radius: 99px;
          position: relative;
          bottom: 30px;
        }

        .delete-question-btn:hover {
          background-color: hsl(0, 0%, 50%);
          color: #fff;
        }

        .name-input {
          padding: 5px;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .options li {
          white-space: nowrap;
        }

        .delete-option-btn {
          border: 1px solid hsl(0, 0%, 82%);
          border-radius: 100px;
          width: 20px;
          height: 20px;
          display: inline-block;
          text-align: center;
          color: hsl(0, 0%, 42%);
          line-height: 16px;
          padding-left: 1px;
          cursor: pointer;
          margin-left: 5px;
        }

        .delete-option-btn:hover {
          background-color: hsl(0, 0%, 42%);
          border-color: #0000;
          color: white;
          text-decoration: none;
        }

        .add-option,
        .add-question {
          font-style: italic;
          padding-left: 8px;
          margin: 3px 0 14px;
          display: inline-block;
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

        .add-question {
          margin: 15px 0 !important;
          background: #fff;
          padding: 10px;
          width: 100%;
        }
      `}</style>
    </div>
  )
}
