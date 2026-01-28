// src/pages/admin/AdminLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const DRAWER_WIDTH = 280;

function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [pendingCount] = useState(3); // TODO: Remplacer par vraie donnée API

  // Vérifie que l'utilisateur est admin
  const isSuperAdmin = user?.role === 'superAdmin';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;

  // Si pas admin, on redirige
  if (!isAdmin) {
    navigate('/home');
    return null;
  }

  // Menu items selon le rôle
  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/admin/dashboard', roles: ['admin', 'superAdmin'] },
    { text: 'Validations', icon: <CheckCircleIcon />, path: '/admin/validations', badge: pendingCount, roles: ['admin', 'superAdmin'] },
    { text: 'Chauffeurs', icon: <PeopleIcon />, path: '/admin/users', roles: ['admin', 'superAdmin'] },
    { text: 'Finance', icon: <MoneyIcon />, path: '/admin/finance', roles: ['superAdmin'] }, // SuperAdmin only
    { text: 'Mon Journal', icon: <HistoryIcon />, path: '/admin/journal', roles: ['admin', 'superAdmin'] },
  ];

  // Filtre selon le rôle
  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    // TODO: Appeler la fonction logout de Redux
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#fff' }}>
      {/* Header Sidebar */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            Y
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
            Yély Admin
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 215, 0, 0.1)' }} />

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.text}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 215, 0, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#FFD700' : 'inherit', minWidth: 40 }}>
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? '#FFD700' : 'inherit',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 215, 0, 0.1)' }} />

      {/* User Profile */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 215, 0, 0.05)' : 'rgba(255, 215, 0, 0.1)',
          }}
        >
          <Avatar
            src={user?.profilePicture}
            sx={{
              width: 45,
              height: 45,
              border: '2px solid #FFD700',
            }}
          >
            {user?.name?.[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isSuperAdmin ? '👑 Super Admin' : '🛡️ Admin'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleLogout} sx={{ color: '#FFD700' }}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      {/* AppBar (Mobile uniquement) */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#fff',
            color: theme.palette.text.primary,
            boxShadow: 'none',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar>
            <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
              Yély Admin
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 0 20px rgba(0,0,0,0.05)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: isMobile ? 8 : 0,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;