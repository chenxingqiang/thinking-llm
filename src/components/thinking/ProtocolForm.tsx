import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Protocol, Template, protocolService, activityService } from '../../services/supabase'

type ProtocolFormData = Omit<Protocol, 'id' | 'created_at' | 'user_id' | 'updated_at' | 'template_id'>

export const ProtocolForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProtocolFormData>({
    title: '',
    description: '',
    content: '',
    status: 'active',
  })

  useEffect(() => {
    if (id) {
      loadProtocol(id)
    } else {
      // Check if we're creating from a template
      const template = location.state?.template as Template | undefined
      if (template) {
        setFormData({
          title: `${template.title} - Copy`,
          description: template.description || '',
          content: template.content,
          status: 'active',
        })
      }
    }
  }, [id, location.state])

  const loadProtocol = async (protocolId: string) => {
    try {
      setLoading(true)
      setError(null)
      const protocol = await protocolService.getById(protocolId)
      if (protocol) {
        setFormData({
          title: protocol.title,
          description: protocol.description,
          content: protocol.content,
          status: protocol.status,
        })
      }
    } catch (err) {
      console.error('Failed to load protocol:', err)
      setError('Failed to load protocol. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const protocolData: Omit<Protocol, 'id' | 'created_at' | 'user_id' | 'updated_at'> = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        status: formData.status || 'active',
        template_id: location.state?.template?.id || null,
      }

      if (id) {
        await protocolService.update(id, protocolData)
      } else {
        const newProtocol = await protocolService.create(protocolData)
        if (newProtocol) {
          await activityService.create({
            type: 'create',
            protocol_id: newProtocol.id,
            protocol_title: newProtocol.title,
          })
        }
      }

      navigate('/')
    } catch (err) {
      console.error('Failed to save protocol:', err)
      setError('Failed to save protocol. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (loading && !formData.title) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" component="h2" gutterBottom>
        {id ? 'Edit Protocol' : 'Create Protocol'}
      </Typography>

      {error && (
        <Box mb={3}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      <Box mb={3}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={2}
          disabled={loading}
        />
      </Box>

      <Box mb={3}>
        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </TextField>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          multiline
          rows={15}
          required
          disabled={loading}
          sx={{
            fontFamily: 'monospace',
          }}
        />
      </Box>

      <Box display="flex" gap={2}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate('/')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !formData.title || !formData.content}
        >
          {loading ? 'Saving...' : id ? 'Update Protocol' : 'Create Protocol'}
        </Button>
      </Box>
    </Box>
  )
}
