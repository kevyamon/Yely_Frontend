// src/pages/SubscriptionPage.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  IconButton,
  CircularProgress,
  useTheme,
  Card,
  CardContent,
  Chip,
  Avatar,
  InputBase
} from '@mui/material';
import { 
  CalendarMonth, 
  Diamond, 
  CheckCircle, 
  Upload, 
  Smartphone,
  ArrowBack,
  LocalOffer
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

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLoading, isSuccess, error, subscriptionData, lastTransaction } = useSelector((state) => state.subscription);

  useEffect(() => { 
    dispatch(checkSubscriptionStatus()); 
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(showToast({ message: 'Preuve reçue ! Validation en cours...', type: 'success' }));
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
      dispatch(showToast({ message: 'Veuillez remplir tous les champs', type: 'error' }));
      return;
    }
    const formData = new FormData();
    formData.append('type', selectedPlan);
    formData.append('paymentPhoneNumber', paymentPhone);
    formData.append('proofImage', proofFile);
    dispatch(submitSubscriptionProof(formData));
  };

  const PlanCard = ({ title, price, originalPrice, features, type, icon: Icon, isPopular }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(255,193,7,0.05) 0%, rgba(0,0,0,0.8) 100%)'
            : 'linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: isPopular ? '2px solid #FFC107' : '1px solid rgba(255,193,7,0.2)',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'visible',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isPopular 
            ? '0 8px 32px rgba(255,193,7,0.3)' 
            : '0 4px 20px rgba(0,0,0,0.1)',
        }}
        onClick={() => handlePlanSelect(type)}
      >
        {isPopular && (
          <Chip 
            label="POPULAIRE" 
            size="small"
            icon={<LocalOffer />}
            sx={{ 
              position: 'absolute',
              top: -12,
              right: 20,
              bgcolor: '#FFC107',
              color: '#000',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(255,193,7,0.4)'
            }}
          />
        )}
        
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: '#FFC107', width: 56, height: 56 }}>
              <Icon sx={{ fontSize: 32, color: '#000' }} />
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

          <Typography variant="h5" fontWeight="900" gutterBottom>
            {title}
          </Typography>

          <Box display="flex" alignItems="baseline" mb={3}>
            <Typography variant="h3" fontWeight="900" color="#FFC107">
              {price}
            </Typography>
            <Typography variant="h6" color="text.secondary" ml={0.5}>
              FCFA
            </Typography>
          </Box>

          <Box mb={3}>
            {features.map((feature, idx) => (
              <Box key={idx} display="flex" alignItems="center" mb={1.5}>
                <CheckCircle sx={{ color: '#FFC107', mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: isPopular ? '#FFC107' : 'rgba(255,193,7,0.1)',
              color: isPopular ? '#000' : '#FFC107',
              fontWeight: 'bold',
              py: 1.5,
              borderRadius: '12px',
              border: isPopular ? 'none' : '2px solid #FFC107',
              '&:hover': {
                bgcolor: '#FFC107',
                color: '#000',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            SÉLECTIONNER
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ActiveView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(0,0,0,0.8) 100%)'
            : 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(76,175,80,0.5)',
          borderRadius: '24px',
          maxWidth: 500,
          mx: 'auto'
        }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Diamond sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
        </motion.div>
        
        <Typography variant="h4" fontWeight="900" gutterBottom>
          Compte Actif ✨
        </Typography>
        
        <Typography variant="body1" color="text.secondary" mb={3}>
          Votre abonnement <Chip label={subscriptionData?.plan === 'WEEKLY' ? 'Hebdo' : 'Mensuel'} size="small" color="success" /> est actif
        </Typography>

        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'rgba(76,175,80,0.1)', 
            borderRadius: '16px',
            mb: 3
          }}
        >
          <Typography variant="h2" fontWeight="900" color="#4CAF50">
            {subscriptionData?.formattedTime || '0j 0h'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Temps restant
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/home')}
          sx={{
            borderColor: '#4CAF50',
            color: '#4CAF50',
            '&:hover': {
              borderColor: '#4CAF50',
              bgcolor: 'rgba(76,175,80,0.1)'
            }
          }}
        >
          Retour à l'accueil
        </Button>
      </Paper>
    </motion.div>
  );

  const PendingView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(0,0,0,0.8) 100%)'
            : 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(33,150,243,0.5)',
          borderRadius: '24px',
          maxWidth: 500,
          mx: 'auto'
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress size={60} sx={{ color: '#2196F3', mb: 2 }} />
        </motion.div>
        
        <Typography variant="h5" fontWeight="900" gutterBottom>
          Vérification en cours ⏳
        </Typography>
        
        <Typography variant="body2" color="text.secondary" mb={3}>
          Un administrateur valide votre paiement. Accès dans 10 minutes maximum.
        </Typography>

        <Button
          size="small"
          onClick={() => dispatch(checkSubscriptionStatus())}
          sx={{ color: '#2196F3' }}
        >
          Rafraîchir le statut
        </Button>
      </Paper>
    </motion.div>
  );

  let content;
  if (subscriptionData?.status === 'active') {
    content = <ActiveView />;
  } else if (isSuccess || lastTransaction?.status === 'PENDING') {
    content = <PendingView />;
  } else if (step === 'SELECTION') {
    content = (
      <Box>
        <Box textAlign="center" mb={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Choisissez votre formule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Payez une seule fois, travaillez en toute liberté
          </Typography>
        </Box>

        <Box 
          display="grid" 
          gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} 
          gap={3}
        >
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
            isPopular={true}
            features={["Accès 30 Jours", "Badge Vérifié", "Économie 16%"]} 
          />
        </Box>
      </Box>
    );
  } else {
    content = (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            background: isDark 
              ? 'rgba(0,0,0,0.6)'
              : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Confirmer le paiement
            </Typography>
            <IconButton onClick={() => setStep('SELECTION')} size="small">
              <ArrowBack />
            </IconButton>
          </Box>

          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'rgba(33,150,243,0.1)',
              borderLeft: '4px solid #2196F3',
              borderRadius: '8px'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              💡 Paiement effectué ? Envoyez la capture d'écran pour activation immédiate.
            </Typography>
          </Paper>

          <form onSubmit={handleSubmitProof}>
            <Box mb={3}>
              <Typography variant="body2" fontWeight="bold" mb={1} color="text.secondary">
                Numéro du dépôt
              </Typography>
              <Paper
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,193,7,0.3)',
                }}
              >
                <Smartphone sx={{ color: '#FFC107', mr: 1 }} />
                <InputBase
                  placeholder="07 07 07 07 07"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  fullWidth
                  required
                />
              </Paper>
            </Box>

            <Box mb={3}>
              <Typography variant="body2" fontWeight="bold" mb={1} color="text.secondary">
                Capture d'écran
              </Typography>
              <Paper
                sx={{
                  position: 'relative',
                  height: 160,
                  border: '2px dashed',
                  borderColor: previewUrl ? '#FFC107' : 'rgba(255,193,7,0.3)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#FFC107',
                    bgcolor: 'rgba(255,193,7,0.05)'
                  }
                }}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preuve" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
                ) : (
                  <Box textAlign="center" color="text.secondary">
                    <Upload sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">
                      Cliquez pour ajouter
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                bgcolor: '#FFC107',
                color: '#000',
                py: 2,
                fontSize: '1.1rem',
                fontWeight: '900',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(255,193,7,0.4)',
                '&:hover': {
                  bgcolor: '#FFD54F',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'ENVOYER LA PREUVE'}
            </Button>
          </form>
        </Paper>
      </motion.div>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 8,
        px: 2
      }}
    >
      <Box maxWidth={900} mx="auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="900" gutterBottom>
              <span style={{ color: '#FFC107' }}>Y</span>
              <span style={{ color: isDark ? '#fff' : '#000' }}>ély</span>
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              ABONNEMENT CHAUFFEUR
            </Typography>
            {IS_PROMO && (
              <Chip 
                label="🔥 PROMO ACTIVE -17%" 
                color="error" 
                sx={{ fontWeight: 'bold', mt: 1 }}
              />
            )}
          </Box>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default SubscriptionPage;