export const ShuffleIcon = ({ fadeIn }: { fadeIn?: boolean }) => (
  <>
    <img className={fadeIn ? 'fade-in' : ''} src="/vote/shuffle.png" />
    <style jsx>{`
      img {
        width: 40px;
        margin: 0 15px;
      }
    `}</style>
  </>
)
