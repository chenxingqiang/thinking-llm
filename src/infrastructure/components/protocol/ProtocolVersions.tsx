import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper } from '@mui/material';
import { GetApp as DownloadIcon } from '@mui/icons-material';
import { useProtocolVersions } from '../../hooks/useProtocolVersions';
import { Version } from '../../types/version';

export const ProtocolVersions: React.FC = () => {
  const { versions } = useProtocolVersions();

  return (
    <Paper>
      <List>
        {versions?.map((version: Version) => (
          <ListItem key={version.id}>
            <ListItemText
              primary={`Version ${version.number}`}
              secondary={version.releaseDate}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="download">
                <DownloadIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 