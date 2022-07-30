import { OnClickButton, darkBlue } from 'src/_shared/Button'
import { api } from 'src/api-helper'

export const FormSubmitBtns = ({
  fields,
  formFieldNames,
  saved,
  setSaved,
  setShowBottom,
}: {
  fields: Record<string, string | boolean | undefined | Record<string, boolean>>
  formFieldNames: string[]
  saved: boolean
  setSaved: (s: boolean) => void
  setShowBottom: (s: boolean) => void
}) => (
  <div>
    <OnClickButton
      style={{ backgroundColor: '#ccc', border: 0, color: '#666', marginLeft: 0 }}
      onClick={async () => {
        setShowBottom(true)
        // setError('')
        const response = await api('citizen-forms/do-you-want-siv', { id: fields.id, skipped: true })
        if (response.ok) return setSaved(true)
      }}
    >
      Skip
    </OnClickButton>

    <OnClickButton
      invertColor
      background={darkBlue}
      disabled={saved}
      style={{ marginRight: 0 }}
      onClick={async () => {
        setShowBottom(true)
        // setError('')

        // Get data from input fields
        formFieldNames.forEach((field) => {
          fields[field] = (document.getElementById(field) as HTMLInputElement).value
        })

        const response = await api('citizen-forms/do-you-want-siv', fields)
        if (response.ok) return setSaved(true)
      }}
    >
      Submit
    </OnClickButton>

    <style jsx>{`
      div {
        text-align: right;
      }
    `}</style>
  </div>
)
