import React from 'react'
import { Box, Grid, Typography, Container } from '@mui/material'
import { ProtocolSearch } from '../components/search/ProtocolSearch'
import { ProtocolCard } from '../components/common/ProtocolCard'
import { useProtocolSearch } from '../hooks/useProtocolSearch'
import { useProtocolExplore } from '../hooks/useProtocolExplore'
import { ErrorBoundary } from '../components/common/ErrorBoundary'
import { Loading } from '../components/common/Loading'

const ExploreProtocols: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    protocols,
    loading,
    error
  } = useProtocolSearch()

  const { handleDelete } = useProtocolExplore()

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Explore Protocols
        </Typography>

        <ErrorBoundary>
          <ProtocolSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {loading ? (
            <Loading message="Loading protocols..." />
          ) : (
            <Grid container spacing={3}>
              {protocols.map((protocol) => (
                <Grid item xs={12} sm={6} md={4} key={protocol.id}>
                  <ProtocolCard
                    protocol={protocol}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
              {protocols.length === 0 && !loading && (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    No protocols found. Try adjusting your search.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </ErrorBoundary>
      </Box>
    </Container>
  )
}

export default ExploreProtocols
