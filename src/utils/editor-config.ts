import type { editor } from 'monaco-editor'

export const DEFAULT_EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  lineNumbers: 'on',
  automaticLayout: true,
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    useShadows: false,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10
  },
  fontSize: 14,
  fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
  renderWhitespace: 'selection',
  tabSize: 2,
  insertSpaces: true,
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  bracketPairColorization: {
    enabled: true
  }
}

export const SUPPORTED_LANGUAGES = [
  'markdown',
  'javascript',
  'typescript',
  'json',
  'python',
  'html',
  'css',
  'yaml'
] as const

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  markdown: 'Markdown',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  python: 'Python',
  html: 'HTML',
  css: 'CSS',
  yaml: 'YAML'
}

export const getLanguageFromFilename = (filename: string): SupportedLanguage => {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'md':
      return 'markdown'
    case 'js':
      return 'javascript'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'json':
      return 'json'
    case 'py':
      return 'python'
    case 'html':
      return 'html'
    case 'css':
      return 'css'
    case 'yml':
    case 'yaml':
      return 'yaml'
    default:
      return 'markdown'
  }
}
