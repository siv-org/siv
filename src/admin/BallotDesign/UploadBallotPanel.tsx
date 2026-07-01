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
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

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
    <div className="flex-1 border border-solid border-gray-300 bg-white p-5 sm:p-8 text-gray-700">
      <div className="max-w-md">
        <h3 className="m-0 text-base font-semibold">Upload Custom Ballot</h3>
        <p className="mt-2 mb-0 text-sm text-gray-600 leading-relaxed">
          Have an existing ballot design? Share your file & we'll work on integrating it into SIV.
        </p>

        <div
          className={`mt-5 flex flex-col items-center justify-center rounded border-2 border-dashed px-6 py-10 text-center transition-colors ${
            disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
              : uploading
                ? 'border-gray-200 bg-gray-50 cursor-default'
                : dragOver
                  ? 'border-blue-400 bg-blue-50/40 cursor-pointer'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/80 cursor-pointer'
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
