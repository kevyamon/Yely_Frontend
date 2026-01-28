// src/pages/admin/UsersManagement.jsx

import { useState, useEffect } from 'react';
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
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Search,
  MoreVert,
  Block,
  CheckCircle,
  Delete,
  Person,
  DirectionsCar,
  AdminPanelSettings,
  FilterList
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { showToast } from '../../features/common/uiSlice';

const UsersManagement = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  
  // Variables d'environnement pour SuperAdmin
  const superAdminEmail = import.meta.env.VITE_ADMIN_MAIL;
  const isSuperAdmin = currentUser?.email === superAdminEmail;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Configuration API
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
      'Authorization': `Bearer ${currentUser?.token}`,
    },
  });

  // 1. Chargement des utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/api/admin/dashboard/users');
      setUsers(data);
    } catch (error) {
      console.error('Erreur users:', error);
      dispatch(showToast({ message: 'Erreur lors du chargement des utilisateurs', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  // 2. Actions (Bloquer / Activer)
  const handleToggleStatus = async (userToEdit) => {
    const newStatus = userToEdit.status === 'active' ? 'inactive' : 'active';
    try {
      await apiClient.put(`/api/admin/dashboard/users/${userToEdit._id}/status`, { status: newStatus });
      
      // Mise à jour locale pour éviter de recharger
      setUsers(users.map(u => u._id === userToEdit._id ? { ...u, status: newStatus } : u));
      
      dispatch(showToast({ 
        message: `Utilisateur ${newStatus === 'active' ? 'activé' : 'bloqué'} avec succès`, 
        type: 'success' 
      }));
    } catch (error) {
      dispatch(showToast({ message: "Impossible de modifier le statut", type: 'error' }));
    }
    handleCloseMenu();
  };

  // 3. Action Supprimer (SuperAdmin Only)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur DÉFINITIVEMENT ?")) return;

    try {
      // Note: Assure-toi d'avoir une route DELETE dans ton backend, sinon utilise le blocage
      // Si la route n'existe pas encore, on peut simuler ou ajouter la route plus tard.
      // Pour l'instant, on suppose que tu l'ajouteras ou qu'elle existe.
       await apiClient.delete(`/api/admin/users/${userId}`); 
       setUsers(users.filter(u => u._id !== userId));
       dispatch(showToast({ message: "Utilisateur supprimé", type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: "Action non disponible ou erreur serveur", type: 'error' }));
    }
    handleCloseMenu();
  };

  // Gestion du Menu Actions
  const handleOpenMenu = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // 4. Filtrage Intelligent
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
    
    if (roleFilter === 'all') return matchesSearch;
    return matchesSearch && u.role === roleFilter;
  });

  // Helpers pour l'affichage
  const getRoleIcon = (role) => {
    if (role === 'admin' || role === 'superAdmin') return <AdminPanelSettings fontSize="small" />;
    if (role === 'driver') return <DirectionsCar fontSize="small" />;
    return <Person fontSize="small" />;
  };

  const getRoleColor = (role) => {
    if (role === 'superAdmin') return 'secondary';
    if (role === 'admin') return 'warning';
    if (role === 'driver') return 'success';
    return 'default'; // rider
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FFC107' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* En-tête */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" gutterBottom>
            Utilisateurs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les {users.length} comptes de la plateforme
          </Typography>
        </Box>
        <Chip 
          label={`${users.filter(u => u.status === 'active').length} Actifs`} 
          color="success" 
          variant="outlined" 
          sx={{ fontWeight: 'bold' }}
        />
      </Box>

      {/* Barre d'outils (Recherche + Filtres) */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: '16px',
          border: '1px solid rgba(255,193,7,0.2)',
          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white'
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
          <TextField
            placeholder="Rechercher (Nom, Email, Tel)..."
            variant="outlined"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px' }
            }}
          />
          
          <Tabs 
            value={roleFilter} 
            onChange={(e, v) => setRoleFilter(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              minWidth: { md: '400px' },
              '& .Mui-selected': { color: '#FFC107 !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#FFC107' }
            }}
          >
            <Tab label="Tous" value="all" sx={{ fontWeight: 'bold', textTransform: 'none' }} />
            <Tab label="Chauffeurs" value="driver" sx={{ fontWeight: 'bold', textTransform: 'none' }} />
            <Tab label="Clients" value="rider" sx={{ fontWeight: 'bold', textTransform: 'none' }} />
            <Tab label="Admins" value="admin" sx={{ fontWeight: 'bold', textTransform: 'none' }} />
          </Tabs>
        </Box>
      </Paper>

      {/* Tableau des utilisateurs */}
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          borderRadius: '16px', 
          border: '1px solid rgba(255,255,255,0.1)',
          background: theme.palette.mode === 'dark' ? '#1E1E1E' : 'white',
          maxHeight: '65vh'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#f5f5f5' }}>Utilisateur</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#f5f5f5' }}>Rôle</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#f5f5f5' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#f5f5f5' }}>Statut</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#f5f5f5' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={u.profilePicture?.url} 
                      alt={u.name}
                      sx={{ bgcolor: getRoleColor(u.role) === 'default' ? '#9e9e9e' : `${getRoleColor(u.role)}.main` }}
                    >
                      {u.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{u.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Inscrit le {new Date(u.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    icon={getRoleIcon(u.role)} 
                    label={u.role === 'rider' ? 'Client' : u.role.toUpperCase()} 
                    color={getRoleColor(u.role)} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{u.email}</Typography>
                  <Typography variant="caption" color="text.secondary">{u.phone}</Typography>
                </TableCell>

                <TableCell>
                  {u.status === 'inactive' ? (
                    <Chip icon={<Block />} label="Bloqué" color="error" size="small" />
                  ) : (
                    <Chip icon={<CheckCircle />} label="Actif" color="success" size="small" />
                  )}
                </TableCell>

                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleOpenMenu(e, u)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Aucun utilisateur trouvé</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu Contextuel Actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: '12px', minWidth: '150px' }
        }}
      >
        <MenuItem onClick={() => handleToggleStatus(selectedUser)}>
          {selectedUser?.status === 'active' ? (
            <>
              <Block fontSize="small" color="error" sx={{ mr: 1 }} /> Bloquer
            </>
          ) : (
            <>
              <CheckCircle fontSize="small" color="success" sx={{ mr: 1 }} /> Activer
            </>
          )}
        </MenuItem>
        
        {isSuperAdmin && (
          <MenuItem onClick={() => handleDeleteUser(selectedUser?._id)} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> Supprimer
          </MenuItem>
        )}
      </Menu>

    </Box>
  );
};

export default UsersManagement;