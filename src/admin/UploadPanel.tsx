import { InboxOutlined } from '@ant-design/icons'
import { ReactNode, useRef, useState } from 'react'

import { Spinner } from './Spinner'

export const UploadPanel = ({
  accept,
  description,
  disabled,
  endpoint,
  onSuccess,
  title,
}: {
  accept?: string
  description: ReactNode
  disabled?: boolean
  endpoint?: string
  onSuccess: (file: File, response: Record<string, unknown>) => JSX.Element | Promise<JSX.Element | string> | string
  title: ReactNode
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [message, setMessage] = useState<null | { content: ReactNode; type: 'error' | 'success' }>(null)

  const handleFile = async (file: File) => {
    if (disabled || !endpoint) return

    setUploading(true)
    setMessage(null)

    try {
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

      const response = await fetch(endpoint, {
        body: JSON.stringify({ content_base64, filename: file.name, mime_type: file.type || null }),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const json = await response.json().catch(() => ({}))

      if (!response.ok) return setMessage({ content: json.error || 'Upload failed', type: 'error' })
      setMessage({ content: await onSuccess(file, json), type: 'success' })
    } catch (error) {
      setMessage({ content: (error instanceof Error && error.message) || 'Upload failed', type: 'error' })
    } finally {
      // Always clear the spinner & file input, so a failure can be retried
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex-1 p-5 text-gray-700 bg-white border border-gray-300 border-solid sm:p-8">
      <div className="w-full">
        <h3 className="m-0 text-base font-semibold">{title}</h3>
        <p className="mt-2 mb-0 leading-relaxed text-gray-600">{description}</p>

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
        accept={accept}
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
