// src/pages/admin/ValidationCenter.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import ValidationCard from '../../components/ui/ValidationCard';
import ProofImageModal from '../../components/ui/ProofImageModal';
import { showToast } from '../../features/common/uiSlice';

function ValidationCenter() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'superAdmin';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState('all');

  // Configuration axios avec token
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${user?.token}`,
    },
  });

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/admin/validations/pending');
      setTransactions(data);
    } catch (error) {
      console.error('Erreur chargement:', error);
      
      let errorMsg = '❌ Impossible de charger les demandes';
      if (error.response?.status === 401) {
        errorMsg = '🔒 Vous devez vous reconnecter';
      } else if (error.message === 'Network Error') {
        errorMsg = '📡 Vérifiez votre connexion internet';
      }
      
      dispatch(showToast({
        message: errorMsg,
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/validations/${transactionId}/approve`);
      
      // Retirer de la liste
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      
      // Toast de succès avec nom du chauffeur
      const driverName = selectedTransaction?.driver?.name || 'Le chauffeur';
      dispatch(showToast({
        message: `✅ ${driverName} peut maintenant travailler !`,
        type: 'success'
      }));
    } catch (error) {
      let errorMsg = '❌ Impossible de valider';
      if (error.response?.status === 401) {
        errorMsg = '🔒 Session expirée. Reconnectez-vous';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      dispatch(showToast({
        message: errorMsg,
        type: 'error'
      }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (transactionId, reason) => {
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/validations/${transactionId}/reject`, { reason });
      
      // Retirer de la liste
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      
      dispatch(showToast({
        message: '✅ Demande rejetée. Le chauffeur a été informé',
        type: 'info'
      }));
    } catch (error) {
      let errorMsg = '❌ Impossible de rejeter';
      if (error.response?.status === 401) {
        errorMsg = '🔒 Session expirée. Reconnectez-vous';
      }
      
      dispatch(showToast({
        message: errorMsg,
        type: 'error'
      }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCardClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  // Filtrage des transactions
  const filteredTransactions = transactions.filter((t) => {
    if (!isSuperAdmin && t.subscriptionType !== 'MONTHLY') return false;
    if (filterTab === 'weekly') return t.subscriptionType === 'WEEKLY';
    if (filterTab === 'monthly') return t.subscriptionType === 'MONTHLY';
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: 2 }}>
        <CircularProgress sx={{ color: '#FFD700' }} />
        <Typography variant="body1" color="text.secondary">
          Chargement des demandes...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ✅ Centre de Validation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Validez ou rejetez les preuves de paiement envoyées par les chauffeurs
        </Typography>
      </Box>

      {/* Stats rapides */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          icon={<ScheduleIcon />}
          label={`${filteredTransactions.length} en attente`}
          sx={{
            bgcolor: 'rgba(255, 152, 0, 0.1)',
            color: '#FF9800',
            fontWeight: 'bold',
            px: 1,
          }}
        />
        {isSuperAdmin && (
          <Chip
            icon={<CheckCircleIcon />}
            label="Mode SuperAdmin"
            sx={{
              bgcolor: 'rgba(255, 215, 0, 0.1)',
              color: '#FFD700',
              fontWeight: 'bold',
              px: 1,
            }}
          />
        )}
      </Box>

      {/* Filtres (SuperAdmin uniquement) */}
      {isSuperAdmin && transactions.length > 0 && (
        <Paper
          sx={{
            mb: 3,
            p: 0.5,
            background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fff',
            borderRadius: 2,
          }}
        >
          <Tabs
            value={filterTab}
            onChange={(e, newValue) => setFilterTab(newValue)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold' },
              '& .Mui-selected': { color: '#FFD700' },
            }}
          >
            <Tab icon={<FilterIcon />} iconPosition="start" label="Tout voir" value="all" />
            <Tab label="🔵 Hebdomadaires" value="weekly" />
            <Tab label="🟣 Mensuels" value="monthly" />
          </Tabs>
        </Paper>
      )}

      {/* Liste des validations */}
      {filteredTransactions.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2, fontSize: '1rem' }}>
          🎉 Aucune demande en attente. Tout est validé !
        </Alert>
      ) : (
        <Grid container spacing={2}>
          <AnimatePresence>
            {filteredTransactions.map((transaction) => (
              <Grid item xs={12} sm={6} md={4} key={transaction._id}>
                <ValidationCard transaction={transaction} onClick={() => handleCardClick(transaction)} />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Modale de zoom */}
      <ProofImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={selectedTransaction}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={actionLoading}
      />
    </Box>
  );
}

export default ValidationCenter;