import { RotateRightOutlined } from '@ant-design/icons'

import { Score, tableData } from './compare-data'

const getScore = (s: Score): number => (typeof s === 'number' ? s : s[0])

export const CompareTable = (): JSX.Element => {
  return (
    <main>
      <h1>Voting Methods Compared</h1>

      <h2>
        Secure Internet Voting (SIV) <i>vs</i> Vote-By-Mail <i>&amp;</i> In&#8209;Person
      </h2>

      <section className="landscape-reminder">
        <RotateRightOutlined /> &nbsp; <b>Tip:</b> Rotate to view in Landscape mode.
      </section>

      <section className="table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Property</th>
              <th>Description</th>
              <th>SIV</th>
              <th>By Mail</th>
              <th>In Person</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td>{row.cat}</td>
                <td className="bold">{row.d_prop}</td>
                <td>{row.desc}</td>
                {[...row.scores].reverse().map((s, j) => (
                  <td
                    className="text-center"
                    key={j}
                    style={{
                      backgroundColor: {
                        1: '#ef4444',
                        2: '#f87171',
                        3: '#fca5a5',
                        4: '#fecaca',
                        5: '' && 'white',
                        6: '#bbf7d0',
                        7: '#86efac',
                        8: '#4ade80',
                        9: '#22c55e',
                      }[getScore(s)],
                    }}
                  >
                    {getScore(s)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <style jsx>{`
        main {
          margin-top: 2rem;
        }

        h1,
        h2 {
          text-align: center;
        }

        i {
          opacity: 0.5;
          padding: 0 1rem;
          font-weight: 400;
        }

        .landscape-reminder {
          text-align: center;
          background: #c9ddff;
          padding: 7px 0;
          display: none;
        }

        @media (max-width: 515px) and (orientation: portrait) {
          .landscape-reminder {
            display: block;
          }
        }

        section.table {
          overflow-x: scroll;
        }

        table {
          border-collapse: collapse;
        }

        th {
          padding: 0 1rem;
        }

        th:nth-child(-n + 3) {
          text-align: left;
          padding-left: 3px;
        }

        td {
          padding: 5px 4px;
        }

        .text-center {
          text-align: center;
        }

        .bold {
          font-weight: 600;
        }

        tr {
          border: 3px solid #fff;
        }

        tbody tr:hover {
          background-color: #f5f5f5;
          border-left-color: #e0e0e0;
        }

        @media (max-width: 700px) {
          main {
            padding: 0 5px;
          }
        }
      `}</style>
    </main>
  )
}
