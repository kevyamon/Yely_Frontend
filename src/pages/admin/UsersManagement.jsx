// src/pages/admin/UsersManagement.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  CircularProgress,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Search,
  MoreVert,
  Block,
  CheckCircle,
  AdminPanelSettings,
  RemoveCircle
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { showToast } from '../../features/common/uiSlice';

const UsersManagement = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'superAdmin';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
      'Authorization': `Bearer ${user?.token}`,
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/api/admin/dashboard/users');
      setUsers(data);
    } catch (error) {
      console.error('Erreur chargement users:', error);
      dispatch(showToast({
        message: '❌ Impossible de charger les utilisateurs',
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await apiClient.put(`/api/admin/dashboard/users/${userId}/status`, {
        status: newStatus
      });

      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, status: newStatus } : u
      ));

      dispatch(showToast({
        message: `✅ Statut mis à jour : ${newStatus}`,
        type: 'success'
      }));

      handleMenuClose();
    } catch (error) {
      dispatch(showToast({
        message: '❌ Erreur lors de la mise à jour',
        type: 'error'
      }));
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      await apiClient.put(`/api/admin/dashboard/users/${userId}/promote`);

      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, role: 'admin' } : u
      ));

      dispatch(showToast({
        message: '✅ Utilisateur promu Admin',
        type: 'success'
      }));

      handleMenuClose();
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || '❌ Erreur promotion',
        type: 'error'
      }));
    }
  };

  const handleRevokeAdmin = async (userId) => {
    try {
      await apiClient.put(`/api/admin/dashboard/users/${userId}/revoke`);

      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, role: u.driverId ? 'driver' : 'rider' } : u
      ));

      dispatch(showToast({
        message: '✅ Privilèges admin révoqués',
        type: 'info'
      }));

      handleMenuClose();
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || '❌ Erreur révocation',
        type: 'error'
      }));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  const getRoleChip = (role) => {
    const config = {
      superAdmin: { label: 'Super Admin', color: '#FFC107' },
      admin: { label: 'Admin', color: '#2196F3' },
      driver: { label: 'Chauffeur', color: '#4CAF50' },
      rider: { label: 'Passager', color: '#9E9E9E' }
    };

    const { label, color } = config[role] || config.rider;

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          bgcolor: `${color}20`,
          color: color,
          fontWeight: 'bold'
        }}
      />
    );
  };

  const getStatusChip = (status) => {
    const config = {
      active: { label: 'Actif', color: '#4CAF50' },
      suspended: { label: 'Suspendu', color: '#FF9800' },
      banned: { label: 'Banni', color: '#F44336' }
    };

    const { label, color } = config[status] || config.active;

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          bgcolor: `${color}20`,
          color: color,
          fontWeight: 'bold'
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', p: 4 }}>
        <CircularProgress sx={{ color: '#FFC107' }} size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          Utilisateurs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gérer les utilisateurs de la plateforme
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          background: isDark
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,193,7,0.2)'
        }}
      >
        <TextField
          fullWidth
          placeholder="Rechercher par nom, email ou téléphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px'
            }
          }}
        />
      </Paper>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          background: isDark
            ? 'rgba(0,0,0,0.4)'
            : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,193,7,0.2)'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Utilisateur</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rôle</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: '#FFC107', color: '#000' }}>
                      {u.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {u.name}
                      </Typography>
                      {u.driverId && (
                        <Typography variant="caption" color="text.secondary">
                          {u.driverId}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{u.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {u.phone}
                  </Typography>
                </TableCell>
                <TableCell>{getRoleChip(u.role)}</TableCell>
                <TableCell>{getStatusChip(u.status)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, u)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedUser?.status === 'active' && (
          <MenuItem onClick={() => handleUpdateStatus(selectedUser._id, 'suspended')}>
            <Block sx={{ mr: 1, fontSize: 20 }} /> Suspendre
          </MenuItem>
        )}
        {selectedUser?.status === 'suspended' && (
          <MenuItem onClick={() => handleUpdateStatus(selectedUser._id, 'active')}>
            <CheckCircle sx={{ mr: 1, fontSize: 20 }} /> Activer
          </MenuItem>
        )}
        {selectedUser?.status !== 'banned' && (
          <MenuItem onClick={() => handleUpdateStatus(selectedUser._id, 'banned')}>
            <RemoveCircle sx={{ mr: 1, fontSize: 20, color: '#F44336' }} /> Bannir
          </MenuItem>
        )}
        {isSuperAdmin && selectedUser?.role !== 'admin' && selectedUser?.role !== 'superAdmin' && (
          <MenuItem onClick={() => handlePromoteToAdmin(selectedUser._id)}>
            <AdminPanelSettings sx={{ mr: 1, fontSize: 20, color: '#2196F3' }} /> Promouvoir Admin
          </MenuItem>
        )}
        {isSuperAdmin && selectedUser?.role === 'admin' && (
          <MenuItem onClick={() => handleRevokeAdmin(selectedUser._id)}>
            <RemoveCircle sx={{ mr: 1, fontSize: 20, color: '#FF9800' }} /> Révoquer Admin
          </MenuItem>
        )}
      </Menu>

      <Box mt={2} textAlign="center">
        <Typography variant="caption" color="text.secondary">
          {filteredUsers.length} utilisateur(s) • {users.filter(u => u.role === 'driver').length} chauffeur(s)
        </Typography>
      </Box>
    </Box>
  );
};

export default UsersManagement;