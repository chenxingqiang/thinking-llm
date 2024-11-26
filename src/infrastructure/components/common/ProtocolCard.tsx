import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Rating, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Protocol } from '../../types/protocol';

interface ProtocolCardProps {
  protocol: Protocol;
}

export const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {protocol.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {protocol.content.substring(0, 100)}...
        </Typography>
        <Box mt={2} mb={1}>
          {protocol.tags.map((tag) => (
            <Chip key={tag.id} label={tag.name} size="small" sx={{ mr: 1 }} />
          ))}
        </Box>
        <Rating value={protocol.rating || 0} readOnly size="small" />
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/protocol/${protocol.id}`}>
          View Details
        </Button>
        <Button size="small">
          Fork
        </Button>
      </CardActions>
    </Card>
  );
}; 