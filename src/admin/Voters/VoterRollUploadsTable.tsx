import { useStored } from '../useStored'

export const VoterRollUploadsTable = () => {
  const { voter_roll_uploads } = useStored()

  if (!voter_roll_uploads?.length) return null

  return (
    <div className="mb-4">
      <details open>
        <summary>
          <span className="p-1 text-sm rounded-lg cursor-pointer hover:bg-gray-100">
            Uploaded voter rolls: {voter_roll_uploads.length}
          </span>
        </summary>
        <table className="mt-1 block w-full pb-3 overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px]">
          <thead>
            <tr className="bg-[#f9f9f9] text-[11px]">
              <th>at</th>
              <th>filename</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {voter_roll_uploads.map(({ filename, uploaded_at }) => (
              <tr key={`${uploaded_at}-${filename}`}>
                <td className="whitespace-nowrap text-[13px]">{new Date(uploaded_at).toLocaleString()}</td>
                <td>{filename}</td>
                <td>
                  Received - <i>Processing</i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}
