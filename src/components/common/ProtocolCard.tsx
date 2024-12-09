import React from 'react'
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material'
import { Protocol } from '../../types/protocol'
import { useNavigate } from 'react-router-dom'

interface ProtocolCardProps {
  protocol: Protocol
  onDelete?: (id: string) => void
}

export const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol, onDelete }) => {
  const navigate = useNavigate()

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {protocol.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {protocol.description}
        </Typography>
        <Box display="flex" gap={1} mb={2}>
          <Chip
            label={protocol.status}
            color={protocol.status === 'active' ? 'success' : 'default'}
            size="small"
          />
          {protocol.template_id && (
            <Chip label="Template Based" color="primary" size="small" />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" display="block">
          Created: {new Date(protocol.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(`/protocols/${protocol.id}`)}>
          View
        </Button>
        <Button
          size="small"
          onClick={() => navigate(`/protocols/${protocol.id}/edit`)}
        >
          Edit
        </Button>
        {onDelete && (
          <Button
            size="small"
            color="error"
            onClick={() => onDelete(protocol.id)}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
