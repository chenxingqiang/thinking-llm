import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function GuidelinePanel() {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Thinking Protocol Guidelines
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Core Principles</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText 
                primary="Natural Thinking Flow"
                secondary="Express thoughts in a natural, stream-of-consciousness manner"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
} 