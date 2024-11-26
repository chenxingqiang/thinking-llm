import { Box, LinearProgress, Typography } from '@mui/material';
import { Pattern } from '../types';

interface PatternChartProps {
  patterns: Pattern[];
}

export function PatternChart({ patterns }: PatternChartProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Thinking Patterns
      </Typography>
      {patterns.map((pattern) => (
        <Box key={pattern.name} sx={{ my: 2 }}>
          <Typography variant="body2" gutterBottom>
            {pattern.name}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={pattern.score * 10} 
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      ))}
    </Box>
  );
} 