import { UploadPanel } from '../UploadPanel'

export const UploadBallotPanel = ({
  disabled,
  election_id,
  setDesign,
}: {
  disabled?: boolean
  election_id?: string
  setDesign: (design: string) => void
}) => {
  return (
    <UploadPanel
      description="Upload your file & we'll work on integrating it into SIV."
      disabled={disabled}
      endpoint={election_id ? `/api/election/${election_id}/admin/upload-ballot-design` : undefined}
      onSuccess={async (file, response) => {
        if (response.format === 'siv_json') {
          const text = await file.text()
          if (confirm('This looks like SIV JSON. Load it into the editor?')) {
            setDesign(JSON.stringify(JSON.parse(text), null, 2))
            return 'Loaded into editor.'
          }
          return 'Uploaded successfully, but you chose not to load it.'
        }

        return (
          <>
            <p className="m-0">
              Thanks, <i>{file.name} </i> uploaded successfully.
            </p>
            <p className="mt-0 mb-2">We&apos;ll let you know when it&apos;s ready to be used.</p>
            <p className="mt-0 mb-0">
              If you have any questions, contact us at{' '}
              <a className="underline" href="mailto:elections@siv.org">
                elections@siv.org
              </a>
              .
            </p>
          </>
        )
      }}
      title="Have a custom ballot design?"
    />
  )
}
