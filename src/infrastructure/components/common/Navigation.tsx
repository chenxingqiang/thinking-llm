import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Typography } from '@mui/material';
import { Search, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1 }}>
          Protocol Hub
        </Typography>
        <Button color="inherit" component={Link} to="/explore">
          Explore
        </Button>
        <Button color="inherit" component={Link} to="/create">
          Create
        </Button>
        <IconButton color="inherit">
          <Search />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}; 