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

  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
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
      const { data } = await apiClient.get('/api/admin/validations/pending');
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
      await apiClient.put(`/api/admin/validations/${transactionId}/approve`);
      
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      
      const driverName = selectedTransaction?.driver?.name || 'Le chauffeur';
      dispatch(showToast({
        message: `✅ ${driverName} peut maintenant travailler !`,
        type: 'success'
      }));
      
      setModalOpen(false);
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
      await apiClient.put(`/api/admin/validations/${transactionId}/reject`, { reason });
      
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      
      dispatch(showToast({
        message: '✅ Demande rejetée',
        type: 'info'
      }));
      
      setModalOpen(false);
    } catch (error) {
      let errorMsg = '❌ Impossible de rejeter';
      if (error.response?.status === 401) {
        errorMsg = '🔒 Session expirée';
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

  const filteredTransactions = transactions.filter((t) => {
    if (!isSuperAdmin && t.type !== 'MONTHLY') return false;
    if (filterTab === 'weekly') return t.type === 'WEEKLY';
    if (filterTab === 'monthly') return t.type === 'MONTHLY';
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: 2, p: 4 }}>
        <CircularProgress sx={{ color: '#FFC107' }} size={60} />
        <Typography variant="body1" color="text.secondary">
          Chargement des demandes...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          Centre de Validation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Validez ou rejetez les preuves de paiement
        </Typography>
      </Box>

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
              bgcolor: 'rgba(255, 193, 7, 0.1)',
              color: '#FFC107',
              fontWeight: 'bold',
              px: 1,
            }}
          />
        )}
      </Box>

      {isSuperAdmin && transactions.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 0.5,
            background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255,255,255,0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(255,193,7,0.2)'
          }}
        >
          <Tabs
            value={filterTab}
            onChange={(e, newValue) => setFilterTab(newValue)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold' },
              '& .Mui-selected': { color: '#FFC107' },
            }}
          >
            <Tab icon={<FilterIcon />} iconPosition="start" label="Tout voir" value="all" />
            <Tab label="📅 Hebdomadaires" value="weekly" />
            <Tab label="💎 Mensuels" value="monthly" />
          </Tabs>
        </Paper>
      )}

      {filteredTransactions.length === 0 ? (
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: '16px', 
            fontSize: '1rem',
            border: '1px solid rgba(33,150,243,0.3)'
          }}
        >
          🎉 Aucune demande en attente. Tout est validé !
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredTransactions.map((transaction) => (
              <Grid item xs={12} sm={6} md={4} key={transaction._id}>
                <ValidationCard 
                  transaction={transaction} 
                  onClick={() => handleCardClick(transaction)} 
                />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

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