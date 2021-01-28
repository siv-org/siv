import { use_stored_info } from '../load-existing'

export const ExistingVoters = () => {
  const { voters } = use_stored_info()
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>email</th>
          <th>voted</th>
        </tr>
      </thead>
      <tbody>
        {voters?.map(([email, has_voted], index) => (
          <tr key={email}>
            <td>{index + 1}</td>
            <td>{email}</td>
            <td>{has_voted}</td>
          </tr>
        ))}
      </tbody>
      <style jsx>{`
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
      `}</style>
    </table>
  )
}
