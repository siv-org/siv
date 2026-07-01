import { InboxOutlined } from '@ant-design/icons'
import { useRef, useState } from 'react'

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
  const [message, setMessage] = useState<null | { text: string; type: 'error' | 'success' }>(null)

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

    if (!response.ok) return setMessage({ text: json.error || 'Upload failed', type: 'error' })

    if (json.format === 'siv_json') {
      const text = await file.text()
      if (confirm('This looks like SIV JSON. Load it into the editor?')) {
        setDesign(JSON.stringify(JSON.parse(text), null, 2))
        return setMessage({ text: 'Loaded into editor.', type: 'success' })
      }
      return setMessage({ text: 'File received — saved for our team.', type: 'success' })
    }

    setMessage({
      text: `Thanks — we received ${file.name}. We'll review it and follow up about your ballot design.`,
      type: 'success',
    })
  }

  return (
    <div className="flex-1 p-5 text-gray-700 bg-white border border-gray-300 border-solid sm:p-8">
      <div className="w-full">
        <h3 className="m-0 text-base font-semibold">Upload Custom Ballot</h3>
        <p className="mt-2 mb-0 leading-relaxed text-gray-600">
          Have a specific ballot design? Share your file &amp; we&apos;ll work on integrating it into SIV.
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
              <span className="mt-3 text-sm font-medium">Click or drag your file here</span>
            </>
          )}
        </div>

        {message && (
          <p className={`mt-4 mb-0 text-sm ${message.type === 'error' ? 'text-red-700' : 'text-green-800'}`}>
            {message.text}
          </p>
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
