import React from 'react';
import { Grid, Typography } from '@mui/material';
import { ProtocolCard } from '../common/ProtocolCard';
import { useFeaturedProtocols } from '../../hooks/useFeaturedProtocols';
import { Protocol } from '../../types/protocol';

export const FeaturedProtocols: React.FC = () => {
  const { protocols, loading, error } = useFeaturedProtocols();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading protocols</div>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Featured Protocols
      </Typography>
      <Grid container spacing={3}>
        {protocols.map((protocol: Protocol) => (
          <Grid item xs={12} sm={6} md={4} key={protocol.id}>
            <ProtocolCard protocol={protocol} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}; 