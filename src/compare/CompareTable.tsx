import { tableData } from './compare-data'

export const CompareTable = (): JSX.Element => {
  return (
    <main>
      <h1>Voting Methods Compared</h1>

      <h2>
        Secure Internet Voting (SIV) <i>vs</i> Vote-By-Mail <i>&amp;</i> In-Person
      </h2>

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
              {row.scores.map((s, j) => (
                <td className="text-center" key={j}>
                  {s}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        main {
          margin-top: 3rem;
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

        th {
          padding: 0 1rem;
        }

        td {
          padding: 0 4px 20px;
        }

        .text-center {
          text-align: center;
        }

        .bold {
          font-weight: 600;
        }
      `}</style>
    </main>
  )
}
