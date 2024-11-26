import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { Box } from '@mui/material';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = 'markdown',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorInstanceRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: 'vs-dark',
        minimap: { enabled: false },
        automaticLayout: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
      });

      editorInstanceRef.current.onDidChangeModelContent(() => {
        onChange(editorInstanceRef.current?.getValue() || '');
      });

      return () => {
        editorInstanceRef.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (editorInstanceRef.current && value !== editorInstanceRef.current.getValue()) {
      editorInstanceRef.current.setValue(value);
    }
  }, [value]);

  return (
    <Box
      ref={editorRef}
      sx={{
        width: '100%',
        height: '600px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    />
  );
}; 