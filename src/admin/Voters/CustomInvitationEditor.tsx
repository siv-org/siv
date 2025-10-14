import { LinkOutlined } from '@ant-design/icons'
import { UnorderedListOutlined } from '@ant-design/icons'
import { OrderedListOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'

import { api } from '../../api-helper'
import { revalidate, useStored } from '../useStored'

interface CustomInvitationEditorProps {
  isCollapsed: boolean
  onToggle: () => void
}

interface ToolbarButtonProps {
  children: React.ReactNode
  className?: string
  onClick: () => void
  tooltip: string
}

const ToolbarButton = ({ children, className = '', onClick, tooltip }: ToolbarButtonProps) => {
  return (
    <button
      className={`relative px-2.5 py-1 text-sm border-0 bg-transparent hover:bg-gray-200 rounded text-gray-700 group ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
      <span className="absolute bottom-full left-1/2 px-2 py-1 mb-2 text-xs text-white whitespace-nowrap bg-gray-800 rounded opacity-0 transition-opacity -translate-x-1/2 pointer-events-none group-hover:opacity-100">
        {tooltip}
      </span>
    </button>
  )
}

export const CustomInvitationEditor = ({ isCollapsed, onToggle }: CustomInvitationEditorProps) => {
  const { custom_invitation_text, election_id } = useStored()
  const [content, setContent] = useState(custom_invitation_text || '')
  const [saved, setSaved] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Update content when custom_invitation_text is loaded from API
  useEffect(() => {
    if (custom_invitation_text !== undefined && custom_invitation_text !== content) {
      setContent(custom_invitation_text)
      if (editorRef.current) {
        editorRef.current.innerHTML = custom_invitation_text
      }
    }
  }, [custom_invitation_text])

  // Initialize editor content once
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = content
      setIsInitialized(true)
    }
  }, [content, isInitialized])

  // Auto-save functionality
  useEffect(() => {
    if (!isInitialized) return

    const timer = setTimeout(async () => {
      const currentContent = editorRef.current?.innerHTML || ''
      if (currentContent !== custom_invitation_text && election_id) {
        setIsSaving(true)
        try {
          await api(`election/${election_id}/admin/update-invitation-text`, {
            custom_invitation_text: currentContent,
          })
          setSaved(true)
          revalidate(election_id)
          setTimeout(() => setSaved(false), 2000)
        } catch (error) {
          console.error('Failed to save invitation text:', error)
        } finally {
          setIsSaving(false)
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, custom_invitation_text, election_id, isInitialized])

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      applyFormat('createLink', url)
    }
  }

  return (
    <div className="my-6">
      {/* Collapsible Header */}
      <button
        className="flex gap-2 items-center px-0 py-2 text-base font-normal bg-transparent border-0 cursor-pointer hover:opacity-70"
        onClick={onToggle}
        type="button"
      >
        <span className="text-lg">{isCollapsed ? '▶' : '▼'}</span>
        <span className="font-semibold">Customize invitation</span>
      </button>

      {/* Editor Content */}
      {!isCollapsed && (
        <div className="bg-white rounded-md border border-gray-300 shadow-sm">
          {/* Toolbar */}
          <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200">
            <ToolbarButton
              className="font-semibold"
              onClick={() => applyFormat('formatBlock', '<h2>')}
              tooltip="Heading"
            >
              H
            </ToolbarButton>
            <ToolbarButton className="font-bold" onClick={() => applyFormat('bold')} tooltip="Bold">
              B
            </ToolbarButton>
            <ToolbarButton className="italic" onClick={() => applyFormat('italic')} tooltip="Italic">
              I
            </ToolbarButton>
            <ToolbarButton onClick={() => applyFormat('insertUnorderedList')} tooltip="Bullet List">
              <UnorderedListOutlined />
            </ToolbarButton>
            <ToolbarButton onClick={insertLink} tooltip="Link">
              <LinkOutlined />
            </ToolbarButton>
            <ToolbarButton onClick={() => applyFormat('insertOrderedList')} tooltip="Numbered List">
              <OrderedListOutlined />
            </ToolbarButton>
          </div>

          {/* Editor Area */}
          <div
            className="p-4 min-h-[250px] max-h-[400px] overflow-y-auto outline-none bg-white text-gray-800"
            contentEditable
            onInput={() => {
              // Trigger save by updating content state
              if (editorRef.current) {
                setContent(editorRef.current.innerHTML)
              }
            }}
            ref={editorRef}
            style={{ fontSize: '14px', lineHeight: '1.6' }}
          />

          {/* Footer */}
          <div className="flex justify-end items-center gap-2 px-4 py-2.5 text-sm border-t border-gray-200 bg-gray-50">
            {saved && <span className="italic text-gray-500">saved.</span>}
            {isSaving && <span className="italic text-gray-400">saving...</span>}
            <span className="text-gray-600">preview:</span>
            <a className="text-blue-600 cursor-pointer hover:underline" href={`/election/${election_id}`}>
              ballot
            </a>
            <span className="text-gray-500">,</span>
            <a className="text-blue-600 cursor-pointer hover:underline">email</a>
          </div>
        </div>
      )}
    </div>
  )
}
