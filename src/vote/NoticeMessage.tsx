type Props = {
  onDismiss: () => void
}

export const NoticeMessage = ({ onDismiss }: Props) => (
  <div className="mt-3 mb-3">
    <div className="flex items-start px-4 py-3 text-sm text-yellow-900 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
      <p className="leading-relaxed">
        <span className="font-semibold">⚠️ Important:</span> Due to a printing & mailing error, households with 4 or
        more voters didn&apos;t receive all their Voter Code invitations. If yours was affected, those voters can still
        cast a Provisional Ballot at{' '}
        <a
          className="font-medium underline text-blue-500/80"
          href="https://11.siv.org/vote"
          rel="noreferrer"
          target="_blank"
        >
          11.siv.org/vote
        </a>
        .
      </p>
      <button
        aria-label="Dismiss important notice"
        className="ml-3 text-lg leading-none text-yellow-700 hover:text-yellow-900"
        onClick={onDismiss}
        type="button"
      >
        ×
      </button>
    </div>
  </div>
)
