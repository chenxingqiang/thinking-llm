import React from 'react';
import { Box, Typography } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { useProtocolHistory } from '../../hooks/useProtocolHistory';

export const ProtocolHistory: React.FC = () => {
  const { history, loading, error } = useProtocolHistory();

  if (loading) return <div>Loading history...</div>;
  if (error) return <div>Error loading history</div>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Protocol History
      </Typography>
      <Timeline>
        {history.map((item: any) => (
          <TimelineItem key={item.id}>
            <TimelineSeparator>
              <TimelineDot color={item.type === 'major' ? 'primary' : 'secondary'} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="subtitle1">
                Version {item.version}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(item.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                {item.description}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}; 