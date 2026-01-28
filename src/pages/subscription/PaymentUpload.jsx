// src/pages/subscription/PaymentUpload.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Button, InputBase, CircularProgress } from '@mui/material';
import { ArrowBack, Smartphone, Upload } from '@mui/icons-material';
import { motion } from 'framer-motion';

const PaymentUpload = ({ onBack, onSubmit, isLoading, selectedPlan }) => {
  const [paymentPhone, setPaymentPhone] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentPhone && file) {
      onSubmit(paymentPhone, file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, backdropFilter: 'blur(20px)', borderRadius: '24px', maxWidth: 500, mx: 'auto',
          bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">Confirmer le paiement</Typography>
          <IconButton onClick={onBack} size="small"><ArrowBack /></IconButton>
        </Box>

        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'rgba(33,150,243,0.1)', borderLeft: '4px solid #2196F3', borderRadius: '8px' }}>
          <Typography variant="body2" color="text.secondary">
            💡 Paiement effectué ? Envoyez la capture d'écran pour activation immédiate.
          </Typography>
        </Paper>

        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <Typography variant="body2" fontWeight="bold" mb={1} color="text.secondary">Numéro du dépôt</Typography>
            <Paper sx={{ p: 1.5, display: 'flex', alignItems: 'center', borderRadius: '12px', border: '1px solid rgba(255,193,7,0.3)' }}>
              <Smartphone sx={{ color: '#FFC107', mr: 1 }} />
              <InputBase 
                placeholder="07 07 07 07 07" fullWidth required 
                value={paymentPhone} onChange={(e) => setPaymentPhone(e.target.value)} 
              />
            </Paper>
          </Box>

          <Box mb={3}>
            <Typography variant="body2" fontWeight="bold" mb={1} color="text.secondary">Capture d'écran</Typography>
            <Paper
              sx={{
                position: 'relative', height: 160, border: '2px dashed',
                borderColor: previewUrl ? '#FFC107' : 'rgba(255,193,7,0.3)',
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', transition: 'all 0.3s ease',
                '&:hover': { borderColor: '#FFC107', bgcolor: 'rgba(255,193,7,0.05)' }
              }}
            >
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
              {previewUrl ? (
                <img src={previewUrl} alt="Preuve" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <Box textAlign="center" color="text.secondary">
                  <Upload sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">Cliquez pour ajouter</Typography>
                </Box>
              )}
            </Paper>
          </Box>

          <Button
            type="submit" fullWidth variant="contained" disabled={isLoading}
            sx={{
              bgcolor: '#FFC107', color: '#000', py: 2, fontSize: '1.1rem', fontWeight: '900',
              borderRadius: '16px', boxShadow: '0 4px 20px rgba(255,193,7,0.4)',
              '&:hover': { bgcolor: '#FFD54F' }
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'ENVOYER LA PREUVE'}
          </Button>
        </form>
      </Paper>
    </motion.div>
  );
};

export default PaymentUpload;