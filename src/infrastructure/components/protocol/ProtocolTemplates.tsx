import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Chip } from '@mui/material';
import { useProtocolStore } from '../../stores/protocolStore';
import { useProtocolTemplates } from '../../hooks/useProtocolTemplates';
import { Loading } from '../common/Loading';
import { Template } from '../../types/template';

export const ProtocolTemplates: React.FC = () => {
  const { updateProtocol } = useProtocolStore();
  const { templates, loading, error } = useProtocolTemplates();

  if (loading) return <Loading message="Loading templates..." />;
  if (error) return <div>Error loading templates</div>;

  const handleTemplateSelect = (templateContent: string) => {
    updateProtocol(templateContent);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Protocol Templates
      </Typography>
      <Grid container spacing={2}>
        {templates.map((template: Template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {template.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {template.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {template.tags.map((tag) => (
                    <Chip 
                      key={tag.id} 
                      label={tag.name} 
                      size="small" 
                      sx={{ mr: 1 }} 
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    v{template.version}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {template.downloads} downloads
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleTemplateSelect(template.content)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 