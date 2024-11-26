import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  Link,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import {
  Add as AddIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Description as ProtocolIcon,
  Dashboard as DashboardIcon,
  FileCopy as TemplateIcon,
} from '@mui/icons-material'

export const Navbar = () => {
  const theme = useTheme()

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
          }}
        >
          Thinking Protocol
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/protocol/create"
            startIcon={<AddIcon />}
          >
            New Protocol
          </Button>
          <Button
            color="inherit"
            startIcon={<TemplateIcon />}
            component={RouterLink}
            to="/templates"
          >
            Templates
          </Button>
          <IconButton color="inherit" size="large">
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
