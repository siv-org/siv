import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Tooltip } from 'src/admin/Voters/Tooltip'
import { Item } from 'src/vote/storeElectionInfo'

import { check_for_urgent_ballot_errors } from './check_for_ballot_errors'
import { IOSSwitch } from './IOSSwitch'

export const Wizard = ({ design, setDesign }: { design: string; setDesign: (s: string) => void }) => {
  const [json, setJson] = useState<Item[]>()

  const errors = check_for_urgent_ballot_errors(design)

  useEffect(() => {
    if (!errors) setJson(JSON.parse(design))
  }, [design])

  return (
    // Wizard container
    <div
      className={`flex-1 border border-solid border-gray-300 text-gray-700 p-2.5 bg-[#eee] pb-0 ${
        errors ? 'bg-gray-100 opacity-30 cursor-not-allowed' : ''
      }`}
    >
      {json?.map(({ id, options, title, write_in_allowed }, questionIndex) => (
        // Each question
        <div className="p-2.5 bg-white mt-4 first:mt-0" key={questionIndex}>
          {/* Question ID Label */}
          <label className="block mt-3.5 text-[10px] italic">
            Question ID{' '}
            <Tooltip
              placement="top"
              title={
                <span style={{ fontSize: 14 }}>
                  This unique short ID is used as the column header for the table of submitted votes.
                </span>
              }
            >
              <span className="relative top-0 text-sm text-indigo-500 left-1">
                <QuestionCircleOutlined />
              </span>
            </Tooltip>
          </label>
          {/* Question ID Input */}
          <div className="flex items-center justify-between">
            <input
              className="p-1 text-sm"
              value={id}
              onChange={({ target }) => {
                const new_json = [...json]
                new_json[questionIndex].id = target.value
                setDesign(JSON.stringify(new_json, undefined, 2))
              }}
            />

            {/* Delete Question btn */}
            <Tooltip placement="top" title="Delete Question">
              <a
                className="relative ml-1 text-xl text-center text-gray-700 rounded-full cursor-pointer w-7 bottom-[30px] hover:bg-gray-500 hover:text-white"
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

          {/* Type selector */}
          <div className="mt-4">
            <label className="text-[10px] italic">Voting Type:</label>

            {/* Type dropdown */}
            <div className="relative">
              <span className="absolute z-20 scale-75 right-3 top-2 opacity-60">▼</span>
              <select
                className="appearance-none border border-solid border-gray-200 text-[13px] rounded focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 shadow-sm relative"
                onChange={({ target }) => {
                  const new_json = [...json]
                  new_json[questionIndex].type = target.value as string
                  setDesign(JSON.stringify(new_json, undefined, 2))
                }}
              >
                <option value="choose-only-one">Choose Only One — FPTP</option>
                <option value="instant-runoff">Ranked Choice — IRV</option>
              </select>
            </div>
          </div>

          {/* Question Title Label */}
          <label className="block mt-4 text-[10px] italic">Question Title:</label>
          {/* Question Title Input */}
          <div className="flex items-center">
            <input
              className="flex-1 p-1 text-sm"
              value={title}
              onChange={({ target }) => {
                const new_json = [...json]
                new_json[questionIndex].title = target.value
                setDesign(JSON.stringify(new_json, undefined, 2))
              }}
            />
          </div>

          {/* Options list */}
          <ul>
            {options?.map(({ name }, optionIndex) => (
              <li key={optionIndex}>
                {/* Option input */}
                <input
                  className="p-[5px] mb-1.5 text-[13px]"
                  value={name}
                  onChange={({ target }) => {
                    const new_json = [...json]
                    new_json[questionIndex].options[optionIndex].name = target.value
                    setDesign(JSON.stringify(new_json, undefined, 2))
                  }}
                />
                {/* Delete Option btn */}
                <a
                  className="inline-block pl-px w-5 h-5 ml-[5px] leading-4 text-center text-gray-600 border border-gray-300 border-solid rounded-full cursor-pointer hover:no-underline hover:bg-gray-500 hover:border-transparent hover:text-white"
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
            {/* Add another option btn */}
            <a
              className="block pl-2 mt-1 mb-[14px] text-[13px] italic cursor-pointer"
              onClick={() => {
                const new_json = [...json]
                new_json[questionIndex].options.push({ name: '' })
                setDesign(JSON.stringify(new_json, undefined, 2))
              }}
            >
              + Add another option
            </a>

            {/* Write-in Allowed toggle */}
            <li className={`${write_in_allowed ? '' : 'list-none'}`}>
              <span
                className={`inline-block w-32 pl-2 text-[13px] italic text-gray-800 ${
                  !write_in_allowed ? 'opacity-60' : ''
                }`}
              >{`Write-in ${write_in_allowed ? 'Allowed' : 'Disabled'}`}</span>
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

      {/* "Add another question" btn */}
      <a
        className="block w-full p-2.5 italic bg-white my-[15px] text-[13px] cursor-pointer"
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
    </div>
  )
}
