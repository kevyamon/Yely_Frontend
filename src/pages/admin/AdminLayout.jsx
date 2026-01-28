// src/pages/admin/AdminLayout.jsx

import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Divider,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  CheckCircle,
  People,
  AttachMoney,
  ExitToApp,
  ChevronLeft,
  AdminPanelSettings
} from '@mui/icons-material';
import { logout } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const drawerWidth = 280;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const isDark = theme.palette.mode === 'dark';

  const superAdminEmail = import.meta.env.VITE_ADMIN_MAIL;
  const isSuperAdmin = user?.email === superAdminEmail;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/admin/dashboard',
      show: true
    },
    { 
      text: 'Validations', 
      icon: <CheckCircle />, 
      path: '/admin/validations',
      badge: 0,
      show: true
    },
    { 
      text: 'Utilisateurs', 
      icon: <People />, 
      path: '/admin/users',
      show: true
    },
    { 
      text: 'Finance', 
      icon: <AttachMoney />, 
      path: '/admin/finance',
      show: isSuperAdmin
    },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          <span style={{ color: '#FFC107' }}>Y</span>
          <span style={{ color: isDark ? '#fff' : '#000' }}>ély</span>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: '16px',
            background: isDark 
              ? 'linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(0,0,0,0.3) 100%)'
              : 'linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(255,255,255,0.5) 100%)',
            border: '1px solid rgba(255,193,7,0.2)'
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: '#FFC107', 
              color: '#000',
              width: 48,
              height: 48,
              fontWeight: 'bold'
            }}
          >
            {isSuperAdmin ? <AdminPanelSettings /> : user?.name?.charAt(0)}
          </Avatar>
          <Box ml={2} flex={1}>
            <Typography variant="body2" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.filter(item => item.show).map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '12px',
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,193,7,0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(255,193,7,0.2)',
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(255,193,7,0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#FFC107' : 'inherit' }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            border: '1px solid rgba(244,67,54,0.3)',
            '&:hover': {
              bgcolor: 'rgba(244,67,54,0.1)',
            }
          }}
        >
          <ListItemIcon sx={{ color: '#f44336' }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText 
            primary="Déconnexion"
            primaryTypographyProps={{ color: '#f44336', fontWeight: 'bold' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: isDark ? 'rgba(10,10,10,0.8)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: { md: 'none' }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            <span style={{ color: '#FFC107' }}>Y</span>ély Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: 'background.default'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: 'background.default',
              borderRight: '1px solid rgba(255,193,7,0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          pt: { xs: 8, md: 0 }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;