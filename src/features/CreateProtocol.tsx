import React from 'react';
import { Container, Grid, Paper, Box, Typography } from '@mui/material';
import { ProtocolEditor } from '../components/editor/ProtocolEditor';
import { ProtocolTemplates } from '../components/protocol/ProtocolTemplates';
import { ProtocolExportImport } from '../components/protocol/ProtocolExportImport';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const CreateProtocol: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Protocol
        </Typography>
        <ProtocolExportImport />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Templates
            </Typography>
            <ErrorBoundary>
              <ProtocolTemplates />
            </ErrorBoundary>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <ErrorBoundary>
            <ProtocolEditor />
          </ErrorBoundary>
        </Grid>
      </Grid>
    </Container>
  );
}; 