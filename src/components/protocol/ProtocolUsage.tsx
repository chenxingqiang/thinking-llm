import React from 'react'
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import { Star as StarIcon } from '@mui/icons-material'
import { Protocol } from '../../types/protocol'

interface Usage {
  id: string
  user_id: string
  protocol_id: string
  created_at: string
  type: 'view' | 'like' | 'share'
}

interface ProtocolUsageProps {
  protocol: Protocol
  usageStats: Usage[]
}

export const ProtocolUsage: React.FC<ProtocolUsageProps> = ({
  usageStats
}) => {
  const viewCount = usageStats.filter((stat) => stat.type === 'view').length
  const likeCount = usageStats.filter((stat) => stat.type === 'like').length
  const shareCount = usageStats.filter((stat) => stat.type === 'share').length

  return (
    <Box component={Paper} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Usage Statistics
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText
            primary="Views"
            secondary={viewCount}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText
            primary="Likes"
            secondary={likeCount}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText
            primary="Shares"
            secondary={shareCount}
          />
        </ListItem>
      </List>
    </Box>
  )
}
