import React from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Paper
} from '@mui/material'
import { RestoreFromTrash as RestoreIcon } from '@mui/icons-material'
import { Protocol } from '../../types/protocol'

interface Version {
  id: string
  content: string
  created_at: string
  protocol_id: string
}

interface ProtocolVersionsProps {
  protocol: Protocol
  versions: Version[]
  onRestore: (version: Version) => void
}

export const ProtocolVersions: React.FC<ProtocolVersionsProps> = ({
  versions,
  onRestore
}) => {
  return (
    <Box component={Paper} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Version History
      </Typography>
      <List>
        {versions.map((version) => (
          <ListItem
            key={version.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => onRestore(version)}>
                <RestoreIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={new Date(version.created_at).toLocaleString()}
              secondary={`Version ${version.id}`}
            />
          </ListItem>
        ))}
        {versions.length === 0 && (
          <ListItem>
            <ListItemText primary="No versions available" />
          </ListItem>
        )}
      </List>
    </Box>
  )
}
