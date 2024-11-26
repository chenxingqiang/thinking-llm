import { Box, Container, Grid, Paper, Typography } from '@mui/material'
import { ThinkingProtocolList } from '../components/thinking/ThinkingProtocolList'
import { RecentActivity } from '../components/dashboard/RecentActivity'

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Thinking Protocol
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <ThinkingProtocolList />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <RecentActivity />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
