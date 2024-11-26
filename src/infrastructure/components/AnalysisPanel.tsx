import { Paper, Typography, Box } from '@mui/material';
import { AnalysisResult } from '../types';
import { PatternChart } from './PatternChart';

interface AnalysisPanelProps {
  analysis: AnalysisResult;
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Analysis Results
      </Typography>
      <Box sx={{ my: 2 }}>
        <Typography variant="h6">Score: {analysis.score}</Typography>
        <Typography color={analysis.passesThreshold ? 'success.main' : 'error.main'}>
          {analysis.passesThreshold ? 'Passes' : 'Does not pass'} threshold
        </Typography>
      </Box>
      <PatternChart patterns={analysis.patterns} />
    </Paper>
  );
} 