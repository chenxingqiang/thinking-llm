import { useState, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'

interface UseEditorOptions {
  initialValue?: string
  onChange?: (value: string) => void
  autosaveKey?: string
  debounceMs?: number
}

export function useEditor({
  initialValue = '',
  onChange,
  autosaveKey,
  debounceMs = 1000
}: UseEditorOptions = {}) {
  const [value, setValue] = useState(initialValue)
  const [isDirty, setIsDirty] = useState(false)

  // Load autosaved content on mount
  useEffect(() => {
    if (autosaveKey) {
      const saved = localStorage.getItem(autosaveKey)
      if (saved) {
        setValue(saved)
      }
    }
  }, [autosaveKey])

  // Debounced autosave
  const debouncedSave = useCallback(
    debounce((newValue: string) => {
      if (autosaveKey) {
        localStorage.setItem(autosaveKey, newValue)
      }
      if (onChange) {
        onChange(newValue)
      }
      setIsDirty(false)
    }, debounceMs),
    [autosaveKey, onChange, debounceMs]
  )

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      if (newValue !== undefined) {
        setValue(newValue)
        setIsDirty(true)
        debouncedSave(newValue)
      }
    },
    [debouncedSave]
  )

  const handleSave = useCallback(() => {
    debouncedSave.flush()
  }, [debouncedSave])

  const clearAutosave = useCallback(() => {
    if (autosaveKey) {
      localStorage.removeItem(autosaveKey)
    }
  }, [autosaveKey])

  return {
    value,
    setValue,
    onChange: handleChange,
    onSave: handleSave,
    isDirty,
    clearAutosave
  }
}
