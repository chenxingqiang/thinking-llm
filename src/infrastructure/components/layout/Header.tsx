import React from 'react';
import { AppBar, Box, Container, IconButton, Typography, Button, useTheme } from '@mui/material';
import { Code as CodeIcon, Search as SearchIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon 
              sx={{ 
                fontSize: 32,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: '50%',
                p: 0.5,
              }} 
            />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Protocol Hub
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              component={Link} 
              to="/explore"
              sx={{ 
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Explore
            </Button>
            <Button 
              component={Link} 
              to="/create"
              variant="contained"
              sx={{ 
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              Create Protocol
            </Button>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton 
              color="inherit"
              href="https://github.com/your-repo"
              target="_blank"
            >
              <GitHubIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}; 