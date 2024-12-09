import React from 'react'
import { Box, Paper } from '@mui/material'
import { MonacoEditor } from '../editor/MonacoEditor'
import { Protocol } from '../../types/protocol'

interface ProtocolContentProps {
  protocol: Protocol
  readOnly?: boolean
  onChange?: (content: string) => void
}

export const ProtocolContent: React.FC<ProtocolContentProps> = ({
  protocol,
  readOnly = true,
  onChange
}) => {
  return (
    <Box component={Paper} sx={{ p: 2 }}>
      <MonacoEditor
        value={protocol.content}
        onChange={(value) => onChange?.(value ?? '')}
        language="markdown"
        readOnly={readOnly}
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false
        }}
      />
    </Box>
  )
}
