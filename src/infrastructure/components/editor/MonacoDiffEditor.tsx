import React from 'react';
import * as monaco from 'monaco-editor';
import { Box } from '@mui/material';

interface MonacoDiffEditorProps {
  original: string;
  modified: string;
  language?: string;
}

export const MonacoDiffEditor: React.FC<MonacoDiffEditorProps> = ({
  original,
  modified,
  language = 'markdown',
}) => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const diffEditorRef = React.useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

  React.useEffect(() => {
    if (editorRef.current) {
      diffEditorRef.current = monaco.editor.createDiffEditor(editorRef.current, {
        automaticLayout: true,
        readOnly: true,
        renderSideBySide: true,
        theme: 'vs-dark',
      });

      const originalModel = monaco.editor.createModel(original, language);
      const modifiedModel = monaco.editor.createModel(modified, language);

      diffEditorRef.current.setModel({
        original: originalModel,
        modified: modifiedModel,
      });

      return () => {
        originalModel.dispose();
        modifiedModel.dispose();
        diffEditorRef.current?.dispose();
      };
    }
  }, [original, modified, language]);

  return <Box ref={editorRef} sx={{ height: '100%' }} />;
}; 