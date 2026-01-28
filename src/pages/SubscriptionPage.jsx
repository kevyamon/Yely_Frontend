// src/pages/admin/SubscriptionPage.jsx (ou src/pages/SubscriptionPage.jsx selon ta structure)
// Vérifie bien le chemin où tu veux le mettre. Ici je suppose src/pages/SubscriptionPage.jsx

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
  Chip,
  Container
} from '@mui/material';
import {
  CheckCircle,
  CloudUpload,
  AccessTime,
  AttachMoney,
  LocalOffer,
  Send
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { showToast } from '../features/common/uiSlice'; // Vérifie ce chemin d'import

const SubscriptionPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isDark = theme.palette.mode === 'dark';

  // États
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('WEEKLY');
  const [hasClickedPay, setHasClickedPay] = useState(false);
  const [proofImage, setProofImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [paymentPhone, setPaymentPhone] = useState(user?.phone || '');

  // Config (Simulée ou depuis ENV)
  const isPromoActive = import.meta.env.VITE_PROMO_MODE === 'true'; // À connecter avec ton backend plus tard
  const weeklyPrice = isPromoActive ? 1000 : 1200;
  const monthlyPrice = isPromoActive ? 5000 : 6000;
  
  const weeklyLink = import.meta.env.VITE_WAVE_LINK_WEEKLY || '#';
  const monthlyLink = import.meta.env.VITE_WAVE_LINK_MONTHLY || '#';

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
    setHasClickedPay(false); // Reset si on change de plan
  };

  const handlePayClick = () => {
    const link = selectedPlan === 'WEEKLY' ? weeklyLink : monthlyLink;
    window.open(link, '_blank');
    setHasClickedPay(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!proofImage || !paymentPhone) {
      dispatch(showToast({ message: "Photo et numéro requis !", type: 'error' }));
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('proofImage', proofImage);
      formData.append('type', selectedPlan);
      formData.append('paymentPhone', paymentPhone);
      formData.append('amount', selectedPlan === 'WEEKLY' ? weeklyPrice : monthlyPrice);

      const apiClient = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      await apiClient.post('/api/subscription/submit-proof', formData);

      dispatch(showToast({ message: "Preuve envoyée ! Validation en cours...", type: 'success' }));
      setHasClickedPay(false);
      setProofImage(null);
      setPreviewUrl(null);

    } catch (error) {
      console.error(error);
      dispatch(showToast({ message: "Erreur lors de l'envoi. Réessayez.", type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const PlanCard = ({ value, title, price, promoPrice, features, recommended }) => (
    <Card 
      elevation={0}
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      sx={{ 
        position: 'relative',
        borderRadius: '20px',
        border: selectedPlan === value ? '2px solid #FFC107' : '1px solid rgba(128,128,128,0.2)',
        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
        overflow: 'visible',
        cursor: 'pointer'
      }}
      onClick={() => setSelectedPlan(value)}
    >
      {recommended && (
        <Chip 
          label="RECOMMANDÉ" 
          color="primary" 
          size="small" 
          sx={{ position: 'absolute', top: -12, right: 20, fontWeight: 'bold' }} 
        />
      )}
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            value={value}
            control={<Radio sx={{ color: '#FFC107', '&.Mui-checked': { color: '#FFC107' } }} />}
            label={<Typography variant="h6" fontWeight="bold">{title}</Typography>}
            checked={selectedPlan === value}
          />
          {isPromoActive && <LocalOffer color="error" className="animate-pulse" />}
        </Box>

        <Box sx={{ mt: 2, mb: 2 }}>
          {isPromoActive ? (
            <Box>
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                {price} FCFA
              </Typography>
              <Typography variant="h4" fontWeight="900" color="error">
                {promoPrice} FCFA
              </Typography>
            </Box>
          ) : (
            <Typography variant="h4" fontWeight="900" color="#FFC107">
              {price} FCFA
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {features.map((feat, i) => (
            <Box key={i} display="flex" alignItems="center" gap={1}>
              <CheckCircle fontSize="small" color="success" />
              <Typography variant="body2" color="text.secondary">{feat}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          Abonnement Premium
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Activez votre compte pour commencer à recevoir des courses.
        </Typography>
      </Box>

      {/* 1. SÉLECTION DU PLAN */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <PlanCard 
            value="WEEKLY" 
            title="Semaine" 
            price="1200" 
            promoPrice="1000" 
            features={['Accès 7 jours', 'Support prioritaire', 'Courses illimitées']} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PlanCard 
            value="MONTHLY" 
            title="Mensuel" 
            price="6000" 
            promoPrice="5000" 
            features={['Accès 30 jours', 'Économisez 15%', 'Badge "Pro"']} 
            recommended={true}
          />
        </Grid>
      </Grid>

      {/* 2. ZONE D'ACTION */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        {!hasClickedPay ? (
          <Button
            variant="contained"
            size="large"
            onClick={handlePayClick}
            sx={{ 
              borderRadius: '50px', 
              px: 6, 
              py: 2, 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              bgcolor: '#FFC107',
              color: 'black',
              '&:hover': { bgcolor: '#FFB300' }
            }}
            endIcon={<AttachMoney />}
          >
            Payer avec Wave
          </Button>
        ) : (
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            Le paiement est ouvert dans une autre fenêtre. Revenez ici une fois payé.
          </Alert>
        )}
      </Box>

      {/* 3. FORMULAIRE DE PREUVE (Apparaît après clic) */}
      <AnimatePresence>
        {hasClickedPay && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                borderRadius: '24px', 
                bgcolor: isDark ? '#1E1E1E' : 'white',
                border: '1px solid #FFC107'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                Confirmation d'activation
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" paragraph>
                Envoyez la capture d'écran de votre paiement pour activation immédiate.
              </Typography>

              <Box component="form" onSubmit={handleSubmitProof} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                
                <TextField
                  label="Numéro ayant payé (Wave)"
                  fullWidth
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  InputProps={{ sx: { borderRadius: '12px' } }}
                />

                <Button
                  component="label"
                  variant="outlined"
                  sx={{ 
                    height: 100, 
                    borderRadius: '16px', 
                    borderStyle: 'dashed', 
                    borderColor: proofImage ? 'success.main' : 'divider'
                  }}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preuve" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <Box textAlign="center">
                      <CloudUpload fontSize="large" color="action" />
                      <Typography variant="body2" color="text.secondary">Cliquez pour ajouter la capture</Typography>
                    </Box>
                  )}
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                  endIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  sx={{ 
                    borderRadius: '12px', 
                    py: 1.5, 
                    fontWeight: 'bold',
                    bgcolor: 'success.main',
                    '&:hover': { bgcolor: 'success.dark' }
                  }}
                >
                  {loading ? 'Envoi...' : 'Envoyer la preuve'}
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default SubscriptionPage;