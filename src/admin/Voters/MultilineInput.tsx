import { Dispatch, SetStateAction } from 'react'
import Editor from 'react-simple-code-editor'

export const MultilineInput = ({ state, update }: { state: string; update: Dispatch<SetStateAction<string>> }) => {
  return (
    <div className="editor-container">
      <Editor
        className="editor"
        highlight={(code) =>
          code
            .split('\n')
            .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
            .join('\n')
        }
        textareaId="textarea"
        value={state}
        onValueChange={(v) => update(v)}
      />
      <style global jsx>{`
        .editor-container {
          max-height: 300px;
          overflow: auto;
          border: 1px solid #ced4da;
          border-radius: 3px;
          margin-top: 5px;
          padding: 5px 0;
        }

        .editor {
          /* Striped background */
          background-image: linear-gradient(#fff 50%, #f6f6f6 50%);
          background-size: 100% 40px; /* 2x line-height */
          background-position: left 0px;
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
    </div>
  )
}
