import React from 'react';
import { Paper, Grid } from '@mui/material';
import { MonacoEditor } from './MonacoEditor';
import { ProtocolPreview } from './ProtocolPreview';
import { useProtocolStore } from '../../stores/protocolStore';

export const ProtocolEditor: React.FC = () => {
  const { protocol, updateProtocol } = useProtocolStore();

  const handleChange = (value: string) => {
    updateProtocol(value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Paper>
          <MonacoEditor
            value={protocol}
            onChange={handleChange}
          />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <ProtocolPreview content={protocol} />
      </Grid>
    </Grid>
  );
}; 