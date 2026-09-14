import { UploadPanel } from '../UploadPanel'

/** Voter roll formats we accept. Enforced server-side; the file picker derives its filter from this. */
export const voter_roll_extensions = ['csv', 'tsv', 'xls', 'xlsx']

export const UploadVoterRollPanel = ({ election_id }: { election_id?: string }) => (
  <UploadPanel
    accept={voter_roll_extensions.map((ext) => `.${ext}`).join(',')}
    description="Upload a CSV or spreadsheet & we'll work on integrating it into SIV."
    endpoint={election_id ? `/api/election/${election_id}/admin/upload-voter-roll` : undefined}
    onSuccess={(file) => (
      <>
        <p className="m-0">
          Thanks, <i>{file.name} </i> uploaded successfully.
        </p>
        <p className="mt-0 mb-2">We&apos;ll let you know when your voter roll is ready to be used.</p>
        <p className="mt-0 mb-0">
          If you have any questions, contact us at{' '}
          <a className="underline" href="mailto:elections@siv.org">
            elections@siv.org
          </a>
          .
        </p>
      </>
    )}
    title="Add a voter roll"
  />
)
