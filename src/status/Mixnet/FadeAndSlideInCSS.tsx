export const FadeAndSlideInCSS = () => {
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

        .fade-in-fast {
          animation .5s ease fade-in-fast;
        }

        @keyframes fade-in-fast {
          0%, 50% {
            opacity: 0;
          }
          100% {
            opacity: 0.5;
          }
        }

        .slide-in {
          animation: 1s linear slide-in;
        }

        @keyframes slide-in {
          0% {
            transform: translateX(-100%);
          }
          65%,
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </>
  )
}
