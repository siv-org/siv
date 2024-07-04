export const Instructions = () => (
  <>
    <p>
      <b>Instructions:</b> Mark your selections then press <em>Submit</em> at the bottom.
    </p>
    <p>
      <img className="relative mr-[7px] top-[3px] opacity-90" src="/vote/lock.png" width="12px" />
      Your choices are encrypted on your own device for strong privacy.{' '}
      <span className="mt-0 text-black/50 sm:pl-5 sm:block">
        No one will see how you vote. Everyone will see vote totals.{' '}
        <a
          className="underline text-inherit hover:text-black/80"
          href="https://docs.siv.org/privacy"
          rel="noreferrer"
          target="_blank"
        >
          Learn more
        </a>
      </span>
    </p>
  </>
)
