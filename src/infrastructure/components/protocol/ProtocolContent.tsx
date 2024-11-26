import React from 'react';
import { Box, Paper } from '@mui/material';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { Protocol } from '../../types/protocol';

interface ProtocolContentProps {
  protocol: Protocol;
}

export const ProtocolContent: React.FC<ProtocolContentProps> = ({ protocol }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ maxWidth: '100%', overflow: 'auto' }}>
        <MarkdownRenderer content={protocol.content} />
      </Box>
    </Paper>
  );
}; 