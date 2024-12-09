import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material'
import { Protocol, protocolService } from '../services/supabase'

export const ProtocolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [protocol, setProtocol] = useState<Protocol | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProtocol = async () => {
      if (!id) return
      try {
        const data = await protocolService.getById(id)
        if (data) {
          setProtocol(data)
        } else {
          setError('Protocol not found')
        }
      } catch (err) {
        console.error('Failed to load protocol:', err)
        setError('Failed to load protocol')
      } finally {
        setLoading(false)
      }
    }

    loadProtocol()
  }, [id])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !protocol) {
    return (
      <Box p={3}>
        <Typography color="error">{error || 'Protocol not found'}</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {protocol.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {protocol.description}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {protocol.content}
        </Typography>
      </Paper>

      <Box display="flex" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(`/protocols/${protocol.id}/edit`)}
        >
          Edit
        </Button>
      </Box>
    </Box>
  )
}
