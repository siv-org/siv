import { useEffect, useState } from 'react'
import { Item } from 'src/vote/storeElectionInfo'

import { check_for_ballot_errors } from './check_for_ballot_errors'

export const PointAndClick = ({ design }: { design: string; setDesign: (s: string) => void }) => {
  /* Features to support

    - [x] See current design

    - [ ] Add new items
    - [ ] Set item ID
    - [ ] Edit item title
    - [ ] Edit item description
    - [ ] Edit item final question ("Should this bill be")
    - [ ] Re-order items
    - [ ] Delete items
    
    - [ ] Create new options
    - [ ] Delete existing options
    - [ ] Reorder existing options
    - [ ] Edit options name
        - [ ] Edit option's subline (e.g. Party affiliation)
        - [ ] Edit option's short_id (if too long)
    - [ ] Toggle 'Write in' allowed
*/
  const [json, setJson] = useState<Item[]>()

  const errors = check_for_ballot_errors(design)

  useEffect(() => {
    if (!errors) setJson(JSON.parse(design))
  }, [design])

  return (
    <div className={`ballot ${errors ? 'errors' : ''}`}>
      {json?.map(({ options, title, write_in_allowed }, index) => (
        <div key={index}>
          <p>{title}</p>
          <ul>
            {options?.map(({ name }, index) => (
              <li key={index}>{name}</li>
            ))}
            {write_in_allowed && <li>[write in]</li>}
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
      `}</style>
    </div>
  )
}
