// src/components/ui/ProofImageModal.jsx
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function ProofImageModal({ open, onClose, transaction, onApprove, onReject, loading }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!transaction) return null;

  const handleApprove = () => {
    onApprove(transaction._id);
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Merci de préciser une raison du rejet');
      return;
    }
    onReject(transaction._id, rejectReason);
    setRejectReason('');
    setShowRejectInput(false);
    onClose();
  };

  const planLabel = transaction.subscriptionType === 'WEEKLY' ? '1 Semaine (1200F)' : '1 Mois (6000F)';
  const planColor = transaction.subscriptionType === 'WEEKLY' ? '#2196F3' : '#9C27B0';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#fff',
          backgroundImage: 'none',
          borderRadius: isMobile ? 0 : 3,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          🔍 Vérification de preuve
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Info Chauffeur */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 215, 0, 0.05)' : 'rgba(255, 215, 0, 0.1)',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.3)'}`,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              CHAUFFEUR
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {transaction.driver?.name || 'Inconnu'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<PhoneIcon />}
                label={transaction.paymentPhone}
                size="small"
                sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', color: '#2196F3' }}
              />
              <Chip
                icon={<MoneyIcon />}
                label={planLabel}
                size="small"
                sx={{ bgcolor: `${planColor}22`, color: planColor, fontWeight: 'bold' }}
              />
              <Chip
                icon={<CalendarIcon />}
                label={new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Image de preuve */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              CAPTURE D'ÉCRAN ENVOYÉE
            </Typography>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                  border: `2px solid ${theme.palette.divider}`,
                }}
              >
                <img
                  src={transaction.proofImageUrl}
                  alt="Preuve de paiement"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x600?text=Image+non+disponible';
                  }}
                />
              </Box>
            </motion.div>
          </Box>

          {/* Zone de rejet */}
          <AnimatePresence>
            {showRejectInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Raison du rejet"
                  placeholder="Ex: Image illisible, montant incorrect, capture d'écran incomplète..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {!showRejectInput ? (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setShowRejectInput(true)}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Rejeter
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleApprove}
              disabled={loading}
              sx={{
                bgcolor: '#4CAF50',
                '&:hover': { bgcolor: '#45a049' },
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              ✅ Valider & Activer
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setShowRejectInput(false)} disabled={loading}>
              Annuler
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleReject}
              disabled={loading || !rejectReason.trim()}
              sx={{ borderRadius: 2, fontWeight: 'bold' }}
            >
              Confirmer le rejet
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ProofImageModal;