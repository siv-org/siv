import { darkBlue, OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

export const FormSubmitBtns = ({
  fields,
  formFieldNames,
  saved,
  setSaved,
  setShowBottom,
}: {
  fields: Record<string, boolean | Record<string, boolean> | string | undefined>
  formFieldNames: string[]
  saved: boolean
  setSaved: (s: boolean) => void
  setShowBottom: (s: boolean) => void
}) => (
  <div>
    <OnClickButton
      onClick={async () => {
        setShowBottom(true)
        // setError('')
        const response = await api('citizen-forms/do-you-want-siv', { id: fields.id, skipped: true })
        if (response.ok) return setSaved(true)
      }}
      style={{ backgroundColor: '#ccc', border: 0, color: '#666', marginLeft: 0 }}
    >
      Skip
    </OnClickButton>

    <OnClickButton
      background={darkBlue}
      disabled={saved}
      invertColor
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
      style={{ marginRight: 0 }}
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
