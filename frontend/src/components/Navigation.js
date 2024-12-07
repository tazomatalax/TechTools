import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Container,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  PrecisionManufacturing as CircuitIcon,
  Code as CodeIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const menuItems = [
    { 
      text: 'Home', 
      icon: <HomeIcon />, 
      path: '/',
      description: 'Return to homepage'
    },
    { 
      text: 'Circuit Dev Tools', 
      icon: <CircuitIcon />, 
      path: '/electronic-tools',
      description: 'Tools for circuit design and analysis'
    },
    { 
      text: 'Code Dev Tools', 
      icon: <CodeIcon />, 
      path: '/software-tools',
      description: 'Tools for software development'
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isCurrentPath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <ConstructionIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" component="div">
          Tech Toolbox
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
            selected={isCurrentPath(item.path)}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 1,
              '&.Mui-selected': {
                backgroundColor: 'rgba(63, 81, 181, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(63, 81, 181, 0.18)',
                },
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: isCurrentPath(item.path) ? 'primary.main' : 'inherit',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              secondary={item.description}
              primaryTypographyProps={{
                sx: { 
                  color: isCurrentPath(item.path) ? 'primary.main' : 'inherit',
                  fontWeight: isCurrentPath(item.path) ? 500 : 400,
                }
              }}
              secondaryTypographyProps={{
                sx: { 
                  fontSize: '0.75rem',
                  display: { xs: 'none', sm: 'block' }
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ConstructionIcon sx={{ color: 'primary.main' }} />
              <Typography 
                variant="h6" 
                component={RouterLink}
                to="/"
                sx={{ 
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Tech Toolbox
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.map((item) => (
                  <Tooltip key={item.text} title={item.description}>
                    <Button
                      color={isCurrentPath(item.path) ? 'primary' : 'inherit'}
                      component={RouterLink}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{ 
                        minWidth: 140,
                        justifyContent: 'flex-start',
                        ...(isCurrentPath(item.path) && {
                          bgcolor: 'rgba(63, 81, 181, 0.12)',
                          '&:hover': {
                            bgcolor: 'rgba(63, 81, 181, 0.18)',
                          },
                        }),
                      }}
                    >
                      {item.text}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
