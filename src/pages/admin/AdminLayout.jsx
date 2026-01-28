// src/pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Typography, 
  Avatar, 
  useTheme, 
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { 
  LayoutDashboard, 
  CheckCircle, 
  Users, 
  Wallet, 
  LogOut, 
  Menu as MenuIcon,
  ShieldAlert,
  ChevronLeft
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';

const drawerWidth = 280;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isSuperAdmin = user?.role === 'superAdmin';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard size={22} /> },
    { path: '/admin/validation', label: 'Validations', icon: <CheckCircle size={22} /> },
    { path: '/admin/users', label: 'Utilisateurs', icon: <Users size={22} /> },
    // Menu Finance (SuperAdmin uniquement)
    ...(isSuperAdmin ? [{ path: '/admin/finance', label: 'Finance & Config', icon: <Wallet size={22} />, isSpecial: true }] : []),
  ];

  // LE DESIGN DU MENU GLASSY
  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      // Fond Glassy pour le menu
      background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      backdropFilter: 'blur(20px)',
      color: 'white'
    }}>
      {/* En-tête du Menu */}
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          width: 40, height: 40, borderRadius: '12px', 
          bgcolor: '#FFC107', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(255, 193, 7, 0.4)'
        }}>
          <ShieldAlert color="black" size={24} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="900" sx={{ lineHeight: 1, letterSpacing: '1px' }}>
            YÉLY <span style={{ color: '#FFC107' }}>ADMIN</span>
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: '2px' }}>CONTROL TOWER</Typography>
        </Box>
      </Box>

      {/* Liste des Liens */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '16px',
                  py: 1.5,
                  transition: 'all 0.3s ease',
                  // Style Actif vs Inactif
                  background: isActive ? 'linear-gradient(90deg, rgba(255,193,7,0.2) 0%, rgba(255,193,7,0.05) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(255,193,7,0.3)' : '1px solid transparent',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                    transform: 'translateX(5px)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#FFC107' : 'rgba(255,255,255,0.5)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 'bold' : 'medium',
                    color: isActive ? '#FFC107' : 'rgba(255,255,255,0.7)'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Pied de page du Menu (Profil) */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box sx={{ 
          p: 2, borderRadius: '20px', 
          bgcolor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 2 
        }}>
          <Avatar src={user?.profilePicture?.url} alt={user?.name} sx={{ width: 40, height: 40, border: '2px solid #FFC107' }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>{user?.name}</Typography>
            <Typography variant="caption" sx={{ color: '#FFC107', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isSuperAdmin ? '👑 Super Admin' : '🛡️ Admin'}
            </Typography>
          </Box>
          <Tooltip title="Déconnexion">
            <IconButton onClick={handleLogout} size="small" sx={{ ml: 'auto', color: '#ff4444', '&:hover': { bgcolor: 'rgba(255,68,68,0.1)' } }}>
              <LogOut size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0a0a0a' }}>
      {/* Bouton Menu Mobile */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { md: 'none' }, position: 'fixed', top: 16, left: 16, zIndex: 1100, bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
      >
        <MenuIcon color="white" />
      </IconButton>

      {/* Drawer Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'transparent', borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer Desktop (Fixe) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'transparent', borderRight: '1px solid rgba(255,255,255,0.05)' },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Zone de Contenu Principale */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'radial-gradient(circle at top right, #1a1a1a 0%, #000000 100%)', // Fond global subtil
          overflowX: 'hidden'
        }}
      >
        {/* On ajoute un spacer pour le mobile car le bouton menu est fixed */}
        <Box sx={{ height: { xs: 60, md: 0 } }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;