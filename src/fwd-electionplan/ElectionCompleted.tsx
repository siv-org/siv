export const ElectionCompleted = () => (
  <div>
    <h2>Election Completed</h2>
    <p>We&apos;ve now succeeded to run an election that&apos;s authenticated, private, and completely verifiable.</p>

    <p>
      For more information, see the{' '}
      <a href="/faq" target="_blank">
        Frequently Asked Questions
      </a>{' '}
      page, or reach out to <a href="mailto:team@siv.org">team@siv.org</a>.
    </p>
    <style jsx>{`
      div {
        text-align: center;
        padding: 0 50px;
        padding-bottom: 30px;
      }

      h2 {
        margin-bottom: 1.5rem;
      }

      a {
        font-weight: bold;
      }

      p {
        margin-bottom: 10px;
      }
    `}</style>
  </div>
)
