export const Errors = ({ error }: { error: null | string }) => {
  if (!error) return null
  return (
    <div>
      <span>⚠️ &nbsp;{error}</span>
      <style jsx>{`
        div {
          position: relative;
        }

        span {
          border: 1px solid rgba(255, 0, 0, 0.44);
          background-color: #ffe5e6;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          position: absolute;
        }
      `}</style>
    </div>
  )
}
