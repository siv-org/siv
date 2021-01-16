export const ElectionTitleInput = () => {
  return (
    <>
      <p>Election Title:</p>
      <input id="election-title" placeholder="Give your election a custom name" />

      <style jsx>{`
        p {
          margin-bottom: 0px;
        }

        input {
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          padding: 8px;
          width: 100%;
        }
      `}</style>
    </>
  )
}
