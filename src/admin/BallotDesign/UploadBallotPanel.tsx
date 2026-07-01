import { InboxOutlined } from '@ant-design/icons'
import { ReactNode, useRef, useState } from 'react'

import { Spinner } from '../Spinner'

export const UploadBallotPanel = ({
  disabled,
  election_id,
  setDesign,
}: {
  disabled?: boolean
  election_id?: string
  setDesign: (design: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [message, setMessage] = useState<null | { content: ReactNode; type: 'error' | 'success' }>(null)

  const handleFile = async (file: File) => {
    if (disabled || !election_id) return

    setUploading(true)
    setMessage(null)

    const content_base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (typeof result !== 'string') return reject(new Error('Failed to read file'))
        const comma = result.indexOf(',')
        if (comma === -1) return reject(new Error('Failed to read file'))
        resolve(result.slice(comma + 1))
      }
      reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })

    const response = await fetch(`/api/election/${election_id}/admin/upload-ballot-design`, {
      body: JSON.stringify({ content_base64, filename: file.name, mime_type: file.type || null }),
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      method: 'POST',
    })

    const json = await response.json().catch(() => ({}))
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''

    if (!response.ok) return setMessage({ content: json.error || 'Upload failed', type: 'error' })

    if (json.format === 'siv_json') {
      const text = await file.text()
      if (confirm('This looks like SIV JSON. Load it into the editor?')) {
        setDesign(JSON.stringify(JSON.parse(text), null, 2))
        return setMessage({ content: 'Loaded into editor.', type: 'success' })
      }
      return setMessage({ content: 'Uploaded successfully, but you chose not to load it.', type: 'success' })
    }

    setMessage({
      content: (
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
      ),
      type: 'success',
    })
  }

  return (
    <div className="flex-1 p-5 text-gray-700 bg-white border border-gray-300 border-solid sm:p-8">
      <div className="w-full">
        <h3 className="m-0 text-base font-semibold">Have a custom ballot design?</h3>
        <p className="mt-2 mb-0 leading-relaxed text-gray-600">
          Upload your file &amp; we&apos;ll work on integrating it into SIV.
        </p>

        <div
          className={`mt-5 flex w-full flex-col items-center justify-center rounded border-2 border-dashed px-6 py-10 text-center transition-colors ${
            disabled
              ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
              : uploading
              ? 'bg-gray-50 border-gray-200 cursor-default'
              : dragOver
              ? 'border-blue-400 cursor-pointer bg-blue-50/40'
              : 'border-gray-300 cursor-pointer hover:border-gray-400 hover:bg-gray-50/80'
          }`}
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          onDragLeave={() => setDragOver(false)}
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled && !uploading) setDragOver(true)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (disabled || uploading) return
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
        >
          {uploading ? (
            <>
              <Spinner />
              <span className="mt-2 text-sm text-gray-500">Uploading…</span>
            </>
          ) : (
            <>
              <InboxOutlined className="text-3xl text-gray-400" />
              <span className="mt-3 text-sm font-medium">Click here or drag & drop your file</span>
            </>
          )}
        </div>

        {message && (
          <div className={`mt-4 text-sm ${message.type === 'error' ? 'text-red-700' : 'text-green-800'}`}>
            {message.content}
          </div>
        )}
      </div>

      <input
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        ref={inputRef}
        type="file"
      />
    </div>
  )
}
