import { useRef, useState } from 'react'

import { Spinner } from '../Spinner'

export const UploadBallotDesignButton = ({
  election_id,
  setDesign,
}: {
  election_id?: string
  setDesign: (design: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'error' | 'idle' | 'success' | 'uploading'>('idle')
  const [message, setMessage] = useState('')

  const handleFile = async (file: File) => {
    if (!election_id) return

    setStatus('uploading')
    setMessage('')

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
    if (!response.ok) {
      setStatus('error')
      setMessage(json.error || 'Upload failed')
      return
    }

    if (json.format === 'siv_json') {
      const text = await file.text()
      if (confirm('Load this ballot design into the editor?')) {
        setDesign(JSON.stringify(JSON.parse(text), null, 2))
        setMessage('Loaded into editor.')
      } else setMessage('Uploaded.')
    } else {
      setMessage("Uploaded. We can't auto-parse this file format yet, but we're working to add support.")
    }

    setStatus('success')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <span className="inline-block ml-2">
      <button
        className="inline-block text-[12px] font-semibold hover:bg-gray-100 px-3 py-1 border border-blue-900 border-solid rounded-lg relative bottom-0.5 text-blue-900 bg-transparent cursor-pointer disabled:opacity-50"
        disabled={status === 'uploading'}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {status === 'uploading' ? (
          <>
            <Spinner /> Uploading...
          </>
        ) : (
          'Upload ballot design'
        )}
      </button>
      <input
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        ref={inputRef}
        type="file"
      />
      {message && (
        <p className={`mt-2 text-xs max-w-md ${status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>{message}</p>
      )}
    </span>
  )
}
