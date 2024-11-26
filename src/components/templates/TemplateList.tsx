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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FileCopy as CopyIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Template, templateService } from '../../services/supabase'

export const TemplateList = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await templateService.list()
      setTemplates(data)
    } catch (err) {
      console.error('Failed to load templates:', err)
      setError('Failed to load templates. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/template/edit/${id}`)
  }

  const handleDelete = async (template: Template) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
      setError(null)
      const deletedTemplate = await templateService.delete(template.id)
      if (!deletedTemplate) {
        throw new Error('Failed to delete template')
      }
      await loadTemplates()
    } catch (err) {
      console.error('Failed to delete template:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete template. Please try again later.')
    }
  }

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const handleCreateFromTemplate = (template: Template) => {
    navigate('/protocol/create', { state: { template } })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2">
          Templates
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/template/create')}
        >
          New Template
        </Button>
      </Box>

      {error && (
        <Box mb={3}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {templates.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="textSecondary">
            No templates found. Create your first one!
          </Typography>
        </Box>
      ) : (
        <List>
          {templates.map((template) => (
            <ListItem
              key={template.id}
              sx={{
                mb: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              button
              onClick={() => handlePreview(template)}
            >
              <ListItemText
                primary={template.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {template.description || 'No description'}
                    </Typography>
                    {template.category && (
                      <Box mt={1}>
                        <Chip
                          size="small"
                          label={template.category}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="use template"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCreateFromTemplate(template)
                  }}
                  sx={{ mr: 1 }}
                >
                  <CopyIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(template.id)
                  }}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(template)
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate?.title}
          {selectedTemplate?.category && (
            <Chip
              size="small"
              label={selectedTemplate.category}
              color="primary"
              variant="outlined"
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate?.description && (
            <Typography color="textSecondary" paragraph>
              {selectedTemplate.description}
            </Typography>
          )}
          <Typography
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
            }}
          >
            {selectedTemplate?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowPreview(false)
              if (selectedTemplate) {
                handleCreateFromTemplate(selectedTemplate)
              }
            }}
          >
            Use Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
