import React from 'react';
import { Box, Typography, Button, Avatar, Chip, Stack } from '@mui/material';
import { Share as ShareIcon, Star as StarIcon } from '@mui/icons-material';
import { Protocol } from '../../types/protocol';

interface ProtocolHeaderProps {
  protocol: Protocol;
  onShare?: () => void;
}

export const ProtocolHeader: React.FC<ProtocolHeaderProps> = ({ protocol, onShare }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          src={protocol.author.avatar_url || undefined}
          alt={protocol.author.name}
          sx={{ width: 48, height: 48 }}
        />
        <Box>
          <Typography variant="h4" gutterBottom>
            {protocol.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            by {protocol.author.name} • Updated {new Date(protocol.updated_at).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {protocol.content.substring(0, 200)}...
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {protocol.tags.map((tag) => (
          <Chip key={tag.id} label={tag.name} size="small" />
        ))}
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<StarIcon />}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          Star ({protocol.rating || 0})
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={onShare}
        >
          Share
        </Button>
      </Box>
    </Box>
  );
}; 