export const FadeInCSS = () => {
  return (
    <>
      <style global jsx>{`
        .fade-in {
          animation: 1s ease fade-in;
        }

        @keyframes fade-in {
          0%,
          90% {
            opacity: 0;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  )
}
