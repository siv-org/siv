import { RotateRightOutlined } from '@ant-design/icons'
import { Fragment } from 'react'

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
        <RotateRightOutlined /> &nbsp; <b>Tip:</b> Looks better in Landscape orientation
      </section>

      <section className="table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th style={{ minWidth: 120 }}>Description</th>
              <th>Name</th>
              <th>SIV</th>
              <th>By Mail</th>
              <th>In Person</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((cat, c_i) => (
              <Fragment key={c_i}>
                {cat.rows.map((row, i) => (
                  <tr className={i == 0 ? 'category-first' : ''} key={i}>
                    {i === 0 && (
                      <td className="no-hover" rowSpan={cat.rows.length}>
                        {cat.name}
                      </td>
                    )}
                    <td className="xs-text-xs">{row.desc}</td>
                    <td className="text-center">{row.d_name}</td>
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
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>

      <style jsx>{`
        main {
          margin-top: 2rem;
          padding: 0 1rem;
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
          padding-bottom: 0.5rem;
        }

        table {
          border-collapse: collapse;
          margin: 0 auto;
        }

        th {
          padding: 0 1rem;
        }

        th:nth-child(-n + 2) {
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

        .xs-text-xs {
          color: #555;
        }

        tr {
          border: 3px solid #fff;
          border-bottom-width: 0;
        }

        tr.category-first {
          border-top-color: #e4e4e4;
          border-top-width: 4px;
        }

        tr.category-first:first-child {
          border-top-width: 1px;
        }

        tbody tr:hover {
          background-color: #f5f5f5;
        }

        .no-hover {
          background-color: white !important;
          color: #555;
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
