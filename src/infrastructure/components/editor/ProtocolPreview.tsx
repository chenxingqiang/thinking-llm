import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface ProtocolPreviewProps {
  content: string;
}

export const ProtocolPreview: React.FC<ProtocolPreviewProps> = ({ content }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Preview
      </Typography>
      <Box sx={{ overflow: 'auto', height: 'calc(100% - 40px)' }}>
        <MarkdownRenderer content={content} />
      </Box>
    </Paper>
  );
}; 