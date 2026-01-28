// src/pages/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Paper, IconButton, CircularProgress, Card, CardContent, 
  Chip, Avatar, InputBase
} from '@mui/material';
import { 
  CalendarMonth, Diamond, CheckCircle, Upload, Smartphone, ArrowBack, LocalOffer
} from '@mui/icons-material';
import { submitSubscriptionProof, resetSubscriptionState, checkSubscriptionStatus } from '../features/subscription/subscriptionSlice';
import { showToast } from '../features/common/uiSlice';

const WAVE_LINK_WEEKLY = import.meta.env.VITE_WAVE_LINK_WEEKLY || "https://wave.com/business/weekly";
const WAVE_LINK_MONTHLY = import.meta.env.VITE_WAVE_LINK_MONTHLY || "https://wave.com/business/monthly";
const IS_PROMO = import.meta.env.VITE_IS_PROMO_ACTIVE === 'true';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState('SELECTION');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLoading, isSuccess, error, subscriptionData, lastTransaction } = useSelector((state) => state.subscription);

  useEffect(() => { 
    dispatch(checkSubscriptionStatus()); 
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(showToast({ message: '✅ Preuve reçue ! Validation en cours...', type: 'success' }));
    }
    if (error) {
      dispatch(showToast({ message: error, type: 'error' }));
      setTimeout(() => dispatch(resetSubscriptionState()), 3000);
    }
  }, [isSuccess, error, dispatch]);

  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
    window.open(planType === 'WEEKLY' ? WAVE_LINK_WEEKLY : WAVE_LINK_MONTHLY, '_blank');
    setStep('CONFIRMATION');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    if (!paymentPhone || !proofFile) {
      dispatch(showToast({ message: '⚠️ Veuillez remplir tous les champs', type: 'warning' }));
      return;
    }
    const formData = new FormData();
    formData.append('type', selectedPlan);
    formData.append('paymentPhoneNumber', paymentPhone);
    formData.append('proofImage', proofFile);
    dispatch(submitSubscriptionProof(formData));
  };

  const PlanCard = ({ title, price, originalPrice, features, type, icon: Icon, isPopular }) => (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,193,7,0.05) 0%, rgba(255,255,255,0.95) 100%)',
        border: isPopular ? '2px solid #FFC107' : '1px solid rgba(255,193,7,0.2)',
        borderRadius: 3,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(255,193,7,0.3)' },
      }}
      onClick={() => handlePlanSelect(type)}
    >
      {isPopular && (
        <Chip label="POPULAIRE" size="small" icon={<LocalOffer />}
          sx={{ position: 'absolute', top: -10, right: 16, bgcolor: '#FFC107', color: '#000', fontWeight: 'bold' }}
        />
      )}
      
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: '#FFC107', width: 48, height: 48 }}>
            <Icon sx={{ fontSize: 28, color: '#000' }} />
          </Avatar>
          {IS_PROMO && originalPrice && (
            <Box textAlign="right">
              <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                {originalPrice}F
              </Typography>
              <Chip label="-17%" size="small" color="error" sx={{ ml: 0.5 }} />
            </Box>
          )}
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom>{title}</Typography>

        <Box display="flex" alignItems="baseline" mb={2}>
          <Typography variant="h3" fontWeight="bold" color="#FFC107">{price}</Typography>
          <Typography variant="h6" color="text.secondary" ml={0.5}>FCFA</Typography>
        </Box>

        <Box mb={2}>
          {features.map((feature, idx) => (
            <Box key={idx} display="flex" alignItems="center" mb={1}>
              <CheckCircle sx={{ color: '#FFC107', mr: 1, fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">{feature}</Typography>
            </Box>
          ))}
        </Box>

        <Button fullWidth variant={isPopular ? 'contained' : 'outlined'}
          sx={{
            bgcolor: isPopular ? '#FFC107' : 'transparent',
            color: isPopular ? '#000' : '#FFC107',
            borderColor: '#FFC107',
            fontWeight: 'bold',
            py: 1.2,
            '&:hover': { bgcolor: '#FFC107', color: '#000' }
          }}
        >
          SÉLECTIONNER
        </Button>
      </CardContent>
    </Card>
  );

  // Vue compte actif
  if (subscriptionData?.status === 'active') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 6, px: 2 }}>
        <Box maxWidth={500} mx="auto">
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '2px solid #4CAF50' }}>
            <Diamond sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>Compte Actif ✨</Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Abonnement <Chip label={subscriptionData?.plan === 'WEEKLY' ? 'Hebdo' : 'Mensuel'} size="small" color="success" /> actif
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'rgba(76,175,80,0.1)', borderRadius: 2, mb: 3 }}>
              <Typography variant="h2" fontWeight="bold" color="#4CAF50">
                {subscriptionData?.formattedTime || '0j 0h'}
              </Typography>
              <Typography variant="caption" color="text.secondary">Temps restant</Typography>
            </Box>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/home')}
              sx={{ borderColor: '#4CAF50', color: '#4CAF50' }}>
              Retour à l'accueil
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  // Vue en attente de validation
  if (isSuccess || lastTransaction?.status === 'PENDING') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 6, px: 2 }}>
        <Box maxWidth={500} mx="auto">
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '2px solid #2196F3' }}>
            <CircularProgress size={50} sx={{ color: '#2196F3', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>Vérification en cours ⏳</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Un admin valide votre paiement. Accès dans 10 min max.
            </Typography>
            <Button size="small" onClick={() => dispatch(checkSubscriptionStatus())} sx={{ color: '#2196F3' }}>
              Rafraîchir le statut
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 6, px: 2 }}>
      <Box maxWidth={900} mx="auto">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" fontWeight="bold">
            <span style={{ color: '#FFC107' }}>Y</span>ély
          </Typography>
          <Typography variant="h5" fontWeight="bold" gutterBottom>ABONNEMENT CHAUFFEUR</Typography>
          {IS_PROMO && <Chip label="🔥 PROMO -17%" color="error" sx={{ fontWeight: 'bold' }} />}
        </Box>

        <AnimatePresence mode="wait">
          {step === 'SELECTION' ? (
            <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box textAlign="center" mb={3}>
                <Typography variant="h6" color="text.secondary">Choisissez votre formule</Typography>
              </Box>
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
                <PlanCard 
                  title="Pass Hebdo" 
                  price={IS_PROMO ? "1000" : "1200"}
                  originalPrice={IS_PROMO ? "1200" : null}
                  type="WEEKLY" 
                  icon={CalendarMonth}
                  features={["Accès 7 Jours", "0% Commission", "Support 24/7"]} 
                />
                <PlanCard 
                  title="Pass Mensuel" 
                  price={IS_PROMO ? "5000" : "6000"}
                  originalPrice={IS_PROMO ? "6000" : null}
                  type="MONTHLY" 
                  icon={Diamond}
                  isPopular
                  features={["Accès 30 Jours", "Badge Vérifié", "Économie 16%"]} 
                />
              </Box>
            </motion.div>
          ) : (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, maxWidth: 500, mx: 'auto' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">Confirmer le paiement</Typography>
                  <IconButton onClick={() => setStep('SELECTION')} size="small">
                    <ArrowBack />
                  </IconButton>
                </Box>

                <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'rgba(33,150,243,0.1)', borderLeft: '4px solid #2196F3', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    💡 Paiement effectué ? Envoyez la capture pour activation immédiate.
                  </Typography>
                </Paper>

                <form onSubmit={handleSubmitProof}>
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight="bold" mb={1}>Numéro du dépôt</Typography>
                    <Paper sx={{ p: 1.5, display: 'flex', alignItems: 'center', borderRadius: 2, border: '1px solid #ddd' }}>
                      <Smartphone sx={{ color: '#FFC107', mr: 1 }} />
                      <InputBase placeholder="07 07 07 07 07" value={paymentPhone} onChange={(e) => setPaymentPhone(e.target.value)} fullWidth required />
                    </Paper>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" fontWeight="bold" mb={1}>Capture d'écran</Typography>
                    <Paper
                      sx={{
                        position: 'relative', height: 140, border: '2px dashed', borderColor: previewUrl ? '#FFC107' : '#ddd',
                        borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden'
                      }}
                    >
                      <input type="file" accept="image/*" onChange={handleFileChange}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preuve" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Box textAlign="center" color="text.secondary">
                          <Upload sx={{ fontSize: 36, mb: 1 }} />
                          <Typography variant="body2">Cliquez pour ajouter</Typography>
                        </Box>
                      )}
                    </Paper>
                  </Box>

                  <Button type="submit" fullWidth variant="contained" disabled={isLoading}
                    sx={{ bgcolor: '#FFC107', color: '#000', py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: 2 }}>
                    {isLoading ? <CircularProgress size={22} sx={{ color: '#000' }} /> : 'ENVOYER LA PREUVE'}
                  </Button>
                </form>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default SubscriptionPage;