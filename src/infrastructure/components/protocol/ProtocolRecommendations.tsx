import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useProtocolRecommendations } from '../../hooks/useProtocolRecommendations';
import { ProtocolCard } from '../common/ProtocolCard';
import { Protocol } from '../../types/protocol';

export const ProtocolRecommendations: React.FC = () => {
  const { recommendations, loading, error } = useProtocolRecommendations();

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>Error loading recommendations</div>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Similar Protocols
      </Typography>
      <Grid container spacing={2}>
        {recommendations.map((protocol: Protocol) => (
          <Grid item xs={12} sm={6} md={4} key={protocol.id}>
            <ProtocolCard protocol={protocol} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 