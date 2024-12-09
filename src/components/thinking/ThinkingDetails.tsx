import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import {
  ThinkingModel,
  ThinkingStep,
  ThinkingGuideline,
  ThinkingFramework,
  thinkingService,
} from '../../services/supabase'

interface ThinkingDetailsProps {
  templateId: string
}

export const ThinkingDetails = ({ templateId }: ThinkingDetailsProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [models, setModels] = useState<ThinkingModel[]>([])
  const [steps, setSteps] = useState<ThinkingStep[]>([])
  const [guidelines, setGuidelines] = useState<ThinkingGuideline[]>([])
  const [frameworks, setFrameworks] = useState<ThinkingFramework[]>([])

  useEffect(() => {
    loadThinkingDetails()
  }, [templateId])

  const loadThinkingDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const [modelsData, stepsData, guidelinesData, frameworksData] = await Promise.all([
        thinkingService.listModels(),
        thinkingService.getSteps(templateId),
        thinkingService.getGuidelines(templateId),
        thinkingService.getFrameworks(templateId),
      ])

      setModels(modelsData)
      setSteps(stepsData)
      setGuidelines(guidelinesData)
      setFrameworks(frameworksData)
    } catch (err) {
      console.error('Failed to load thinking details:', err)
      setError('Failed to load thinking details. Please try again later.')
    } finally {
      setLoading(false)
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
      {/* Thinking Models */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Thinking Models</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {models.map((model) => (
              <ListItem key={model.id}>
                <ListItemText
                  primary={model.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {model.description || 'No description'}
                      </Typography>
                      <Box mt={1}>
                        <Chip
                          size="small"
                          label={model.api_key_required ? 'API Key Required' : 'No API Key Required'}
                          color={model.api_key_required ? 'warning' : 'success'}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Thinking Steps */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Thinking Steps</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {steps.map((step) => (
              <ListItem key={step.id}>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1">{step.name}</Typography>
                      <Chip
                        size="small"
                        label={`Step ${step.order_index}`}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      {step.description && (
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {step.description}
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
                        {step.content}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Guidelines */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Guidelines</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {guidelines.map((guideline) => (
              <ListItem key={guideline.id}>
                <ListItemText
                  primary={guideline.title}
                  secondary={
                    <Box>
                      {guideline.description && (
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {guideline.description}
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
                        {guideline.content}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Frameworks */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Frameworks</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {frameworks.map((framework) => (
              <ListItem key={framework.id}>
                <ListItemText
                  primary={framework.name}
                  secondary={
                    <Box>
                      {framework.description && (
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {framework.description}
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
                        {framework.content}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
