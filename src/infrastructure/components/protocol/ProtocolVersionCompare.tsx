import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { MonacoDiffEditor } from '../editor/MonacoDiffEditor';

interface ProtocolVersionCompareProps {
  originalVersion: string;
  modifiedVersion: string;
}

export const ProtocolVersionCompare: React.FC<ProtocolVersionCompareProps> = ({
  originalVersion,
  modifiedVersion,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Version Comparison
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ height: '600px' }}>
            <MonacoDiffEditor
              original={originalVersion}
              modified={modifiedVersion}
              language="markdown"
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}; 