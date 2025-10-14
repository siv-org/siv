import { LinkOutlined, OrderedListOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { api } from 'src/api-helper'

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

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) insertMarkdown('[', `](${url})`, 'link text')
  }

  return (
    <div className="my-6">
      {/* Collapsible Header */}
      <button
        className="flex gap-2 items-center px-0 py-2 text-base font-normal bg-transparent border-0 cursor-pointer hover:opacity-70"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <span className="text-lg">{isExpanded ? '▼' : '▶'}</span>
        <span className="font-semibold">Customize invitation</span>
      </button>

      {/* Editor Content */}
      {isExpanded && (
        <div className="bg-white rounded-md border border-gray-300 shadow-sm">
          {/* Toolbar */}
          <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200">
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
            <ToolbarButton onClick={() => insertMarkdown('- ', '', 'list item')} tooltip="Bullet List">
              <UnorderedListOutlined />
            </ToolbarButton>
            <ToolbarButton onClick={insertLink} tooltip="Link">
              <LinkOutlined />
            </ToolbarButton>
            <ToolbarButton onClick={() => insertMarkdown('1. ', '', 'list item')} tooltip="Numbered List">
              <OrderedListOutlined />
            </ToolbarButton>
          </div>

          {/* Editor Area */}
          <textarea
            className="w-full p-4 min-h-[250px] max-h-[400px] resize-y outline-none bg-white text-gray-800 border-0"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your custom invitation text using markdown formatting..."
            ref={textareaRef}
            style={{ fontSize: '14px', lineHeight: '1.6' }}
            value={content}
          />

          {/* Footer */}
          <div className="flex justify-between items-center px-4 py-2.5 text-sm border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2 items-center">
              {isSaving && <span className="italic text-gray-400">saving...</span>}
              {saved && <span className="italic text-gray-500">saved.</span>}

              <span className="text-gray-600">preview:</span>
              <a className="text-blue-600 cursor-pointer hover:underline" href={`/election/${election_id}`}>
                ballot
              </a>
              <span className="text-gray-500">,</span>
              <a className="text-blue-600 cursor-pointer hover:underline">email</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
