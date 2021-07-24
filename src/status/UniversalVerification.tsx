export const UniversalVerification = () => {
  return (
    <p>
      <a href={`${window.location.href}/proofs`} rel="noreferrer" target="_blank">
        <b>✓</b>Universal ZK Proofs Verified
      </a>
      <style jsx>{`
        b {
          color: green;
          border: 1px solid rgb(50, 140, 50);
          border-radius: 30px;
          width: 22px;
          display: inline-block;
          text-align: center;
          margin-right: 5px;
        }
      `}</style>
    </p>
  )
}
