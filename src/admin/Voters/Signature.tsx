export const Signature = ({ esignature }: { esignature?: string }) => {
  return (
    <td>
      <img src={esignature} />
      <style jsx>{`
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
        }

        img {
          max-width: 100px;
        }
      `}</style>
    </td>
  )
}
