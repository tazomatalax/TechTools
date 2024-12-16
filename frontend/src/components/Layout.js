import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Container
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Memory as ElectronicIcon,
  Terminal as CommunicationIcon,
  Code as DeveloperIcon,
} from '@mui/icons-material';
import Icon from '@mdi/react';
import { mdiSineWave } from '@mdi/js';
import { Link as RouterLink } from 'react-router-dom';
import AdSense from './AdSense';

const menuItems = [
  {
    text: 'Electronic Design',
    icon: <ElectronicIcon />,
    path: '/electronic-tools'
  },
  {
    text: 'Signal & Power',
    icon: <Icon path={mdiSineWave} size={1} />,
    path: '/signal-power-tools'
  },
  {
    text: 'Data & Communication',
    icon: <CommunicationIcon />,
    path: '/communication-tools'
  },
  {
    text: 'Developer Tools',
    icon: <DeveloperIcon />,
    path: '/developer-tools'
  }
];

function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerWidth = 240;

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(99, 132, 255, 0.1) 0%, rgba(26, 26, 26, 0) 70%)',
          zIndex: -1,
        }
      }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  color: 'primary.light',
                },
              }}
            >
              Tech Tools
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar /> {/* This creates space for the AppBar */}
          <Box
            sx={{ width: drawerWidth }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton component={RouterLink} to={item.path}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar /> {/* This creates space for the AppBar */}
          {children}
              
          {/* Bottom Ad */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
            bottom: 0,
          }}>
            <Box sx={{
              maxWidth: '100%',
              width: '100%',
              mx: 'auto'
            }}>
              <AdSense adSlot="6238779360" />
            </Box>
          </Box>
        </Box>

        <Box 
          component="footer" 
          sx={{ 
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                {new Date().getFullYear()} Tech Toolbox. All rights reserved.
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2,
                  '& a': {
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <a href="/about">About</a>
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
                <a href="/contact">Contact</a>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default Layout;
