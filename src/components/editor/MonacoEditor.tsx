import React, { useCallback } from 'react'
import Editor, { OnMount, OnChange } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { DEFAULT_EDITOR_OPTIONS, SupportedLanguage } from '../../utils/editor-config'

export interface MonacoEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  language?: SupportedLanguage
  height?: string | number
  width?: string | number
  options?: editor.IStandaloneEditorConstructionOptions
  onSave?: (value: string) => void
  readOnly?: boolean
  loading?: React.ReactNode
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = 'markdown',
  height = '500px',
  width = '100%',
  options = {},
  onSave,
  readOnly = false,
  loading = <div>Loading editor...</div>
}) => {
  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    // Add save command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave(editor.getValue())
      }
    })

    // Add format command
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })
  }, [onSave])

  const handleChange: OnChange = useCallback((value) => {
    onChange(value)
  }, [onChange])

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    ...DEFAULT_EDITOR_OPTIONS,
    readOnly,
    ...options
  }

  return (
    <Editor
      value={value}
      onChange={handleChange}
      onMount={handleEditorDidMount}
      language={language}
      height={height}
      width={width}
      options={editorOptions}
      theme="vs-dark"
      loading={loading}
    />
  )
}
