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
  Collapse,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FileCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Template, templateService, thinkingService, ThinkingStep, ThinkingGuideline, ThinkingFramework } from '../../services/supabase'

export const TemplateList = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [templateDetails, setTemplateDetails] = useState<{
    steps: ThinkingStep[]
    guidelines: ThinkingGuideline[]
    frameworks: ThinkingFramework[]
  }>({
    steps: [],
    guidelines: [],
    frameworks: [],
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    if (expandedTemplate) {
      loadTemplateDetails(expandedTemplate)
    }
  }, [expandedTemplate])

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

  const loadTemplateDetails = async (templateId: string) => {
    try {
      const [steps, guidelines, frameworks] = await Promise.all([
        thinkingService.getSteps(templateId),
        thinkingService.getGuidelines(templateId),
        thinkingService.getFrameworks(templateId),
      ])
      setTemplateDetails({ steps, guidelines, frameworks })
    } catch (err) {
      console.error('Failed to load template details:', err)
      setError('Failed to load template details. Please try again later.')
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

  const handleExpandClick = (templateId: string) => {
    setExpandedTemplate(expandedTemplate === templateId ? null : templateId)
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
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              <Box display="flex" alignItems="center">
                <IconButton
                  size="small"
                  onClick={() => handleExpandClick(template.id)}
                  sx={{ mr: 1 }}
                >
                  {expandedTemplate === template.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
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
                    onClick={() => handleCreateFromTemplate(template)}
                    sx={{ mr: 1 }}
                  >
                    <CopyIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEdit(template.id)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(template)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </Box>

              <Collapse in={expandedTemplate === template.id}>
                <Box p={2}>
                  {templateDetails.steps.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Thinking Steps
                      </Typography>
                      <List dense>
                        {templateDetails.steps.map((step) => (
                          <ListItem key={step.id}>
                            <ListItemText
                              primary={step.name}
                              secondary={step.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {templateDetails.guidelines.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Guidelines
                      </Typography>
                      <List dense>
                        {templateDetails.guidelines.map((guideline) => (
                          <ListItem key={guideline.id}>
                            <ListItemText
                              primary={guideline.title}
                              secondary={guideline.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {templateDetails.frameworks.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Frameworks
                      </Typography>
                      <List dense>
                        {templateDetails.frameworks.map((framework) => (
                          <ListItem key={framework.id}>
                            <ListItemText
                              primary={framework.name}
                              secondary={framework.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              </Collapse>
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
