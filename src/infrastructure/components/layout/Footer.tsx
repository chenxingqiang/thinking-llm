import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link, useTheme } from '@mui/material';
import { GitHub, Twitter } from '@mui/icons-material';
import { DiscordIcon } from '../icons/DiscordIcon';

export const Footer: React.FC = () => {
  const theme = useTheme();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Changelog', href: '/changelog' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Community', href: '/community' },
      { name: 'Support', href: '/support' },
      { name: 'Status', href: '/status' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Partners', href: '/partners' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, rgba(18,18,18,0) 0%, rgba(18,18,18,1) 100%)',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Protocol Hub
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Building the future of thinking protocols, one step at a time.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                href="https://github.com/your-repo"
                target="_blank"
              >
                <GitHub />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                href="https://twitter.com/your-account"
                target="_blank"
              >
                <Twitter />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                href="https://discord.gg/your-server"
                target="_blank"
              >
                <DiscordIcon />
              </IconButton>
            </Box>
          </Grid>

          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} md={2} key={category}>
              <Typography
                variant="subtitle1"
                sx={{ 
                  color: 'white',
                  textTransform: 'uppercase',
                  mb: 2,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {category}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {links.map((link) => (
                  <Box component="li" key={link.name} sx={{ mb: 1 }}>
                    <Link
                      href={link.href}
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            mt: 6,
            pt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Protocol Hub. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/privacy" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}; 