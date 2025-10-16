import { LinkOutlined, OrderedListOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { api } from 'src/api-helper'
import { bytesToHex } from 'src/crypto/bytes-to-hex'
import { sha256 } from 'src/crypto/sha256'

import { useUser } from '../auth'
import { useStored } from '../useStored'

const ToolbarButton = ({
  children,
  className = '',
  onClick,
  tooltip,
}: {
  children: React.ReactNode
  className?: string
  onClick: () => void
  tooltip: string
}) => {
  return (
    <button
      className={`relative px-2.5 py-1 text-sm border-0 bg-transparent hover:bg-gray-200 rounded text-gray-700 group ${className}`}
      onClick={onClick}
      type="button"
    >
      {/* Icon */}
      {children}

      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 px-2 py-1 mb-2 text-xs text-white whitespace-nowrap bg-gray-800 rounded opacity-0 transition-opacity -translate-x-1/2 pointer-events-none group-hover:opacity-100">
        {tooltip}
      </span>
    </button>
  )
}

export const CustomInvitationEditor = () => {
  const { custom_invitation_text, election_id } = useStored()
  const { user } = useUser()
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Update content when custom_invitation_text is loaded from API
  useEffect(() => {
    if (!custom_invitation_text) return
    if (custom_invitation_text === content) return

    setContent(custom_invitation_text)
  }, [custom_invitation_text])

  // Auto-save functionality
  useEffect(() => {
    setSaved(false)
    if (!election_id) return
    if (content === custom_invitation_text) return

    const timer = setTimeout(async () => {
      setIsSaving(true)

      await api(`election/${election_id}/admin/update-invitation-text`, {
        custom_invitation_text: content,
      }).catch((error) => {
        console.error('Failed to save invitation text:', error)
        alert('Failed to save invitation text: ' + error.message)
      })

      setIsSaving(false)
      setSaved(true)

      // Hide "Saved" after a few seconds
      setTimeout(() => setSaved(false), 5000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, election_id, custom_invitation_text])

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newContent = content.substring(0, start) + before + textToInsert + after + content.substring(end)

    setContent(newContent)

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const hasFeatureAccess = useFeatureAccess(user?.email)
  if (!hasFeatureAccess) return null

  return (
    <div className="-mt-6 mb-6">
      {/* Collapsible Header */}
      <button
        className="flex gap-2 items-center px-0 py-2 text-sm bg-transparent border-0 cursor-pointer hover:opacity-80"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <span>{isExpanded ? '▼' : '▶'}</span>
        <span>Customize invitation</span>
      </button>

      {/* Editor Content */}
      {isExpanded && (
        <div className="rounded border border-gray-300 border-solid shadow-sm">
          {/* Toolbar */}
          <div className="flex gap-1 justify-end p-2 bg-gray-50">
            <ToolbarButton
              className="font-semibold"
              onClick={() => insertMarkdown('## ', '', 'Heading')}
              tooltip="Heading"
            >
              H
            </ToolbarButton>
            <ToolbarButton className="font-bold" onClick={() => insertMarkdown('**', '**', 'bold text')} tooltip="Bold">
              B
            </ToolbarButton>
            <ToolbarButton className="italic" onClick={() => insertMarkdown('*', '*', 'italic text')} tooltip="Italic">
              I
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                const url = prompt('Enter URL:')
                if (url) insertMarkdown('[', `](${url})`, 'link text')
              }}
              tooltip="Link"
            >
              <LinkOutlined />
            </ToolbarButton>
            <ToolbarButton onClick={() => insertMarkdown('- ', '', 'list item')} tooltip="Bullet List">
              <UnorderedListOutlined />
            </ToolbarButton>
            <ToolbarButton onClick={() => insertMarkdown('1. ', '', 'list item')} tooltip="Numbered List">
              <OrderedListOutlined />
            </ToolbarButton>
          </div>

          {/* Editor Area */}
          <textarea
            className="w-full p-4 min-h-[250px] resize-y outline-none bg-white text-gray-800 border-0 text-sm"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your custom invitation text..."
            ref={textareaRef}
            value={content}
          />

          {/* Footer */}
          <div className="flex justify-between items-center px-4 py-2.5 text-sm border-t border-gray-200 bg-gray-50">
            <div>
              {isSaving && <span className="italic text-gray-400">saving...</span>}
              {saved && <span className="italic text-green-700">saved.</span>}
            </div>

            <div>
              <span className="text-gray-600">
                <span className="text-xs">🔍</span> preview:{' '}
              </span>
              <a
                className="text-blue-600 cursor-pointer hover:underline"
                href={`/election/${election_id}/vote?auth=preview`}
                rel="noreferrer"
                target="_blank"
              >
                ballot
              </a>
              <span className="text-gray-500">, </span>
              <a
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={async (e) => {
                  e.preventDefault()
                  const confirmed = confirm(`Would you like to receive a mock email invitation at ${user?.email}?`)
                  if (confirmed) {
                    try {
                      const response = await api(`election/${election_id}/admin/send-test-invitation`)

                      if (response.ok) {
                        const result = await response.json()
                        alert(`Test invitation email sent successfully to ${result.recipient}`)
                      } else {
                        const error = await response.json()
                        alert(`Failed to send test email: ${error.error || 'Unknown error'}`)
                      }
                    } catch (error) {
                      console.error('Error sending test invitation:', error)
                      alert('Failed to send test email. Please try again.')
                    }
                  }
                }}
              >
                email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function useFeatureAccess(email: string) {
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      if (!email) return
      const hash = bytesToHex(new Uint8Array(await sha256(email + 'saltedsdjfksj'))).slice(0, 15)
      // alert('hash: ' + hash)
      if (hash in allowedUsers) return setHasAccess(true)
    }
    checkAccess()
  }, [email])

  return hasAccess
}

const allowedUsers = {
  '1471fccb124bbf4': 's@A',
  '8044b24d7e96606': 'EHZ',
  d12bc8d54668685: 'A@s',
}
