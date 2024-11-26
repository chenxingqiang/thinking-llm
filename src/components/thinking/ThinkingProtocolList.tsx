import { useState, useEffect } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Protocol, protocolService, activityService } from '../../services/supabase'

export const ThinkingProtocolList = () => {
  const navigate = useNavigate()
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProtocols()
  }, [])

  const loadProtocols = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await protocolService.list()
      setProtocols(data)
    } catch (err) {
      console.error('Failed to load protocols:', err)
      setError('Failed to load protocols. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/protocol/edit/${id}`)
  }

  const handleDelete = async (protocol: Protocol) => {
    if (!window.confirm('Are you sure you want to delete this protocol?')) {
      return
    }

    try {
      setError(null)
      
      // First create the activity record
      const activity = await activityService.create({
        type: 'delete',
        protocol_id: protocol.id,
        protocol_title: protocol.title,
      })

      if (!activity) {
        throw new Error('Failed to create activity record')
      }

      // Then delete the protocol
      const deletedProtocol = await protocolService.delete(protocol.id)
      if (!deletedProtocol) {
        throw new Error('Failed to delete protocol')
      }

      // Refresh the list
      await loadProtocols()
    } catch (err) {
      console.error('Failed to delete protocol:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete protocol. Please try again later.')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box mb={3}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2">
          Thinking Protocols
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/protocol/create')}
        >
          New Protocol
        </Button>
      </Box>

      {protocols.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="textSecondary">
            No protocols found. Create your first one!
          </Typography>
        </Box>
      ) : (
        <List>
          {protocols.map((protocol) => (
            <ListItem
              key={protocol.id}
              sx={{
                mb: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemText
                primary={protocol.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {protocol.description || 'No description'}
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        size="small"
                        label={protocol.status}
                        color={protocol.status === 'active' ? 'success' : 'default'}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        Last updated: {new Date(protocol.updated_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEdit(protocol.id)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(protocol)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
