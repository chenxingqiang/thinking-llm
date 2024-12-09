import React from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';
import { ProtocolSearch } from '../components/search/ProtocolSearch';
import { ProtocolCard } from '../components/common/ProtocolCard';
import { useProtocolSearch } from '../hooks/useProtocolSearch';
import { Protocol } from '../types/protocol';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Loading } from '../components/common/Loading';

export const ExploreProtocols: React.FC = () => {
  const { searchQuery, setSearchQuery, protocols, loading, error } = useProtocolSearch();

  if (loading) return <Loading message="Loading protocols..." />;
  if (error) return <div>Error loading protocols: {error}</div>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Explore Protocols
        </Typography>
        <ProtocolSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </Box>
      <Grid container spacing={3}>
        {protocols.map((protocol: Protocol) => (
          <Grid item xs={12} sm={6} md={4} key={protocol.id}>
            <ErrorBoundary>
              <ProtocolCard protocol={protocol} />
            </ErrorBoundary>
          </Grid>
        ))}
        {protocols.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No protocols found. Try adjusting your search.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};