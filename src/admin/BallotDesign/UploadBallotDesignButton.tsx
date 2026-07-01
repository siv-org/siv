import { useRef, useState } from 'react'

import { Spinner } from '../Spinner'

const tabClassName =
  'select-none cursor-pointer border border-solid border-gray-400/70 border-l-0 hover:bg-gray-50 active:bg-gray-200 px-[15px] py-[5px]'

export const UploadBallotDesignButton = ({
  election_id,
  setDesign,
}: {
  election_id?: string
  setDesign: (design: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    if (!election_id) return

    setUploading(true)

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

    if (!response.ok) return alert(json.error || 'Upload failed')

    if (json.format === 'siv_json') {
      const text = await file.text()
      if (confirm('Load this ballot design into the editor?')) {
        setDesign(JSON.stringify(JSON.parse(text), null, 2))
        return alert('Loaded into editor.')
      }
      return alert('Uploaded.')
    }

    alert("Uploaded. We can't auto-parse this file format yet, but we're working to add support.")
  }

  return (
    <label className={`${tabClassName} hidden sm:inline ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
      <input
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        ref={inputRef}
        type="file"
      />
      {uploading ? (
        <>
          <Spinner /> Uploading...
        </>
      ) : (
        'Upload'
      )}
    </label>
  )
}
