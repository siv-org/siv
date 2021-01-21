export const Footer = ({ style }: { style?: React.CSSProperties }) => (
  <p style={{ fontSize: 11, ...style }}>
    <b>
      This election is powered by{' '}
      <a href="https://secureinternetvoting.org" rel="noreferrer" target="_blank">
        SecureInternetVoting.org
      </a>
    </b>
    <style jsx>{`
      p {
        margin: 3rem 0;
        text-align: center;
      }
    `}</style>
  </p>
)
