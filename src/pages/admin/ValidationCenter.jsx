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
import { useSelector } from 'react-redux';
import axios from 'axios';

import ValidationCard from '../../components/ui/ValidationCard';
import ProofImageModal from '../../components/ui/ProofImageModal';

function ValidationCenter() {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'superAdmin';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState('all'); // all | weekly | monthly

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/validations/pending');
      setTransactions(data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    try {
      setActionLoading(true);
      await axios.put(`/api/admin/validations/${transactionId}/approve`);
      
      // Retirer de la liste
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      
      alert('✅ Abonnement activé avec succès !');
    } catch (error) {
      alert('❌ Erreur: ' + (error.response?.data?.message || 'Impossible de valider'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (transactionId, reason) => {
    try {
      setActionLoading(true);
      await axios.put(`/api/admin/validations/${transactionId}/reject`, { reason });
      
      // Retirer de la liste
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      
      alert('❌ Demande rejetée. Le chauffeur a été notifié.');
    } catch (error) {
      alert('❌ Erreur: ' + (error.response?.data?.message || 'Impossible de rejeter'));
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
    // Si admin normal, il ne voit QUE les mensuels
    if (!isSuperAdmin && t.subscriptionType !== 'MONTHLY') return false;

    // Filtre par onglet
    if (filterTab === 'weekly') return t.subscriptionType === 'WEEKLY';
    if (filterTab === 'monthly') return t.subscriptionType === 'MONTHLY';
    return true; // all
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#FFD700' }} />
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
          label={`${transactions.length} en attente`}
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
      {isSuperAdmin && (
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
        <Alert severity="info" sx={{ borderRadius: 2 }}>
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