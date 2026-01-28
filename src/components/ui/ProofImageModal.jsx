// src/components/ui/ProofImageModal.jsx

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  TextField,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Cancel,
  Phone,
  CalendarMonth,
  Diamond,
  AttachMoney
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ProofImageModal = ({ open, onClose, transaction, onApprove, onReject, loading }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!transaction) return null;

  const isWeekly = transaction.type === 'WEEKLY';
  const planColor = isWeekly ? '#2196F3' : '#9C27B0';
  const PlanIcon = isWeekly ? CalendarMonth : Diamond;

  const handleRejectClick = () => {
    if (!rejectReason.trim()) {
      return;
    }
    onReject(transaction._id, rejectReason);
    setRejectMode(false);
    setRejectReason('');
  };

  const handleClose = () => {
    setRejectMode(false);
    setRejectReason('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: isDark
            ? 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(26,26,26,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,250,250,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${planColor}30`
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1
        }}
      >
        <IconButton onClick={handleClose} sx={{ bgcolor: 'rgba(0,0,0,0.5)' }}>
          <Close sx={{ color: '#fff' }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box
          component="img"
          src={transaction.proofImageUrl}
          alt="Preuve"
          sx={{
            width: '100%',
            maxHeight: '60vh',
            objectFit: 'contain',
            bgcolor: '#000',
            borderRadius: '24px 24px 0 0'
          }}
        />

        <Box sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar
              sx={{
                bgcolor: `${planColor}20`,
                width: 56,
                height: 56
              }}
            >
              <PlanIcon sx={{ color: planColor, fontSize: 32 }} />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold">
                {transaction.driver?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {transaction.driver?.email}
              </Typography>
            </Box>
            <Chip
              label={transaction.driver?.driverId}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              mb: 3,
              p: 2,
              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderRadius: '16px'
            }}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <PlanIcon sx={{ fontSize: 20, color: planColor }} />
                <Typography variant="caption" color="text.secondary">
                  Formule
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight="bold">
                {isWeekly ? 'Hebdomadaire' : 'Mensuel'}
              </Typography>
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <AttachMoney sx={{ fontSize: 20, color: '#4CAF50' }} />
                <Typography variant="caption" color="text.secondary">
                  Montant
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight="bold" color="#4CAF50">
                {transaction.amount} FCFA
              </Typography>
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Numéro de paiement
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight="bold">
                {transaction.paymentPhoneNumber}
              </Typography>
            </Box>
          </Box>

          <AnimatePresence mode="wait">
            {rejectMode ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Pourquoi rejetez-vous cette demande ? (ex: Image floue, montant incorrect...)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
                <Box display="flex" gap={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setRejectMode(false)}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={handleRejectClick}
                    disabled={loading || !rejectReason.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : <Cancel />}
                  >
                    {loading ? 'Rejet...' : 'Confirmer le rejet'}
                  </Button>
                </Box>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Box>
      </DialogContent>

      {!rejectMode && (
        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="large"
            onClick={() => setRejectMode(true)}
            disabled={loading}
            startIcon={<Cancel />}
            sx={{
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 'bold'
            }}
          >
            REJETER
          </Button>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => onApprove(transaction._id)}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{
              bgcolor: '#4CAF50',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#45A049'
              }
            }}
          >
            {loading ? 'VALIDATION...' : 'VALIDER'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ProofImageModal;