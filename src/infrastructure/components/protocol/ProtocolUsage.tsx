import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CodeBlock } from '../common/CodeBlock';

const usageExample = `
import { useProtocol } from '@protocol-hub/react';

const MyComponent = () => {
  const { protocol, loading, error } = useProtocol('protocol-id');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{protocol.name}</h1>
      <pre>{protocol.content}</pre>
    </div>
  );
};
`;

export const ProtocolUsage: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Usage Example
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" gutterBottom>
          Here's how to use this protocol in your React application:
        </Typography>
      </Box>
      <CodeBlock language="typescript" value={usageExample} />
    </Paper>
  );
}; 