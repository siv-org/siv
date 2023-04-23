import { RotateRightOutlined } from '@ant-design/icons'

import { tableData } from './ecompare-data'

export const ECompareTable = (): JSX.Element => {
  return (
    <main>
      <h1>Electronic Voting Methods Compared</h1>

      <section className="landscape-reminder">
        <RotateRightOutlined /> &nbsp; <b>Tip:</b> Looks better in Landscape orientation
      </section>

      <section className="table">
        <table>
          <thead>
            <tr>
              <th style={{ minWidth: 120 }}>Property</th>
              <th>Emailing Marked Ballots</th>
              <th>Democracy&shy;Live (Omni&shy;Ballot)</th>
              <th>Voatz</th>
              <th>SIV</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td className="xs-text-xs">{row[0]}</td>
                {row[1].map((meets, j) => (
                  <td
                    className="text-center bold"
                    key={j}
                    style={{
                      color: {
                        0: '#fca5a5',
                        1: '#006C28',
                      }[meets],
                    }}
                  >
                    {{ 0: '❌', 1: '✓' }[meets]}
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
          padding: 0 1rem;
        }

        h1 {
          text-align: center;
        }

        .landscape-reminder {
          text-align: center;
          background: #dfebff;
          padding: 7px 0;
          display: none;
          margin-bottom: 1rem;
        }

        @media (max-width: 515px) and (orientation: portrait) {
          .landscape-reminder {
            display: block;
          }
        }

        section.table {
          overflow-x: scroll;
          padding-bottom: 10rem;
        }

        table {
          border-collapse: collapse;
          margin: 0 auto;
        }

        th {
          padding: 0 1rem;
        }

        th:first-child {
          text-align: left;
          padding-left: 3px;
        }

        td {
          padding: 5px 4px;
        }

        .bold {
          font-weight: 600;
        }

        .xs-text-xs {
          color: #555;
        }

        tbody tr {
          border: 1px solid #fff;
          border-bottom-width: 0;
          border-top-color: #e4e4e4;
        }

        tbody tr:hover {
          background-color: #f5f5f5;
        }

        @media (max-width: 700px) {
          main {
            padding: 0 5px;
          }

          th {
            padding: 0 5px;
          }

          @media (orientation: portrait) {
            .xs-text-xs {
              font-size: 12px;
            }
          }
        }
      `}</style>
    </main>
  )
}
