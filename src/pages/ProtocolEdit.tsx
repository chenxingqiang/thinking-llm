import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { Protocol, protocolService, activityService } from '../services/supabase'

export default function ProtocolEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [protocol, setProtocol] = useState<Partial<Protocol>>({
    title: '',
    description: '',
    content: '',
    status: 'active',
  })

  useEffect(() => {
    if (id && id !== 'new') {
      loadProtocol(id)
    }
  }, [id])

  const loadProtocol = async (protocolId: string) => {
    setLoading(true)
    try {
      const data = await protocolService.getById(protocolId)
      setProtocol(data)
      setError(null)
    } catch (err) {
      console.error('Failed to load protocol:', err)
      setError('Failed to load protocol. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Protocol) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProtocol((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      if (!protocol.title || !protocol.content) {
        throw new Error('Title and content are required')
      }

      if (id === 'new') {
        const newProtocol = await protocolService.create({
          title: protocol.title,
          description: protocol.description || '',
          content: protocol.content,
          status: protocol.status as 'active' | 'archived',
        })
        await activityService.create({
          type: 'create',
          protocol_id: newProtocol.id,
          protocol_title: newProtocol.title,
        })
      } else if (id) {
        const updatedProtocol = await protocolService.update(id, protocol)
        await activityService.create({
          type: 'edit',
          protocol_id: updatedProtocol.id,
          protocol_title: updatedProtocol.title,
        })
      }

      navigate('/')
    } catch (err) {
      console.error('Failed to save protocol:', err)
      setError(err instanceof Error ? err.message : 'Failed to save protocol')
    } finally {
      setLoading(false)
    }
  }

  if (loading && id !== 'new') {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/')}
            sx={{ textDecoration: 'none' }}
          >
            Home
          </Link>
          <Typography color="text.primary">
            {id === 'new' ? 'Create Protocol' : 'Edit Protocol'}
          </Typography>
        </Breadcrumbs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                {id === 'new' ? 'Create New Protocol' : 'Edit Protocol'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                required
                fullWidth
                label="Title"
                value={protocol.title}
                onChange={handleChange('title')}
                error={!protocol.title}
                helperText={!protocol.title && 'Title is required'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Status"
                value={protocol.status}
                onChange={handleChange('status')}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={protocol.description}
                onChange={handleChange('description')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={10}
                label="Protocol Content"
                value={protocol.content}
                onChange={handleChange('content')}
                error={!protocol.content}
                helperText={!protocol.content && 'Content is required'}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Protocol'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  )
}
