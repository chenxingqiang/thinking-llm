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
import { useNavigate, useParams } from 'react-router-dom'
import { templateService } from '../../services/supabase'

const CATEGORIES = ['General', 'Decision Making', 'Problem Solving', 'Analysis', 'Research', 'Other']

interface TemplateFormData {
  title: string
  description: string
  content: string
  category: string
  status: 'active' | 'archived'
}

export const TemplateForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    description: '',
    content: '',
    category: 'General',
    status: 'active',
  })

  useEffect(() => {
    if (id) {
      loadTemplate(id)
    }
  }, [id])

  const loadTemplate = async (templateId: string) => {
    try {
      setLoading(true)
      setError(null)
      const template = await templateService.getById(templateId)
      if (template) {
        setFormData({
          title: template.title,
          description: template.description || '',
          content: template.content,
          category: template.category || 'General',
          status: template.status || 'active',
        })
      }
    } catch (err) {
      console.error('Failed to load template:', err)
      setError('Failed to load template. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)

      if (id) {
        await templateService.update(id, formData)
      } else {
        await templateService.create(formData)
      }

      navigate('/templates')
    } catch (err) {
      console.error('Failed to save template:', err)
      setError(err instanceof Error ? err.message : 'Failed to save template. Please try again later.')
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
        {id ? 'Edit Template' : 'Create Template'}
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
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={loading}
        >
          {CATEGORIES.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
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
          rows={10}
          required
          disabled={loading}
          sx={{
            fontFamily: 'monospace',
          }}
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

      <Box display="flex" gap={2}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate('/templates')}
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
          {loading ? 'Saving...' : id ? 'Update Template' : 'Create Template'}
        </Button>
      </Box>
    </Box>
  )
}
