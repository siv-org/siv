import { useState } from 'react'
import Editor from 'react-simple-code-editor'

export const AddParticipants = () => {
  const [content, set_content] = useState(`example@dsernst.com
another@dsernst.com
morevoters@dsernst.com
andsomeonelse@dsernst.com`)
  return (
    <>
      <label>Add voters by email address:</label>
      <div className="editor-container">
        <Editor
          className="editor"
          highlight={(code) =>
            code
              .split('\n')
              .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
              .join('\n')
          }
          padding={5}
          textareaId="textarea"
          value={content}
          onValueChange={(v) => set_content(v)}
        />
      </div>
      <style global jsx>{`
        .editor-container {
          max-height: 300px;
          overflow: auto;
          border: 1px solid #ced4da;
          border-radius: 3px;
          margin: 0.5rem 0;
        }

        .editor {
          line-height: 22px;
        }

        .editor #textarea,
        .editor pre {
          padding-left: 46px !important;
        }

        .editor .editorLineNumber {
          position: absolute;
          left: 0px;
          opacity: 0.6;
          text-align: right;
          width: 28px;
          font-weight: 200;
        }
      `}</style>
    </>
  )
}
