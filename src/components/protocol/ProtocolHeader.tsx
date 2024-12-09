import React from 'react'
import { Box, Typography, Chip, Stack } from '@mui/material'
import { Protocol } from '../../types/protocol'

interface ProtocolHeaderProps {
  protocol: Protocol
}

export const ProtocolHeader: React.FC<ProtocolHeaderProps> = ({ protocol }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {protocol.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {protocol.description}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Chip label={protocol.status} color="primary" variant="outlined" />
        {protocol.tags?.map((tag) => (
          <Chip key={tag} label={tag} variant="outlined" />
        ))}
      </Stack>
    </Box>
  )
}
