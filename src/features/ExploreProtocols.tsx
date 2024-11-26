import React from 'react';
import { Container, Grid, Box, Typography, Pagination } from '@mui/material';
import { ProtocolSearch } from '../components/search/ProtocolSearch';
import { ProtocolCard } from '../components/common/ProtocolCard';
import { useProtocolSearch } from '../hooks/useProtocolSearch';
import { useProtocolExplore } from '../hooks/useProtocolExplore';
import { Protocol } from '../types/protocol';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Loading } from '../components/common/Loading';

export const ExploreProtocols: React.FC = () => {
  const { search, selectedTags } = useProtocolSearch();
  const { protocols, totalPages, currentPage, setCurrentPage, loading, error } = useProtocolExplore({
    search,
    tags: selectedTags,
  });

  if (loading) return <Loading message="Loading protocols..." />;
  if (error) return <div>Error loading protocols</div>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Explore Protocols
        </Typography>
        <ProtocolSearch />
      </Box>
      <Grid container spacing={3}>
        {protocols.map((protocol: Protocol) => (
          <Grid item xs={12} sm={6} md={4} key={protocol.id}>
            <ErrorBoundary>
              <ProtocolCard protocol={protocol} />
            </ErrorBoundary>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    </Container>
  );
}; 