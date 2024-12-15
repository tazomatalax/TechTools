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
  ListItemButton
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

  return (
    <>
      <AppBar position="static">
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
      >
        <Box
          sx={{ width: 250 }}
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

      {children}
    </>
  );
}

export default Layout;
