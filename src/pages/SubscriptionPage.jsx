// src/pages/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { submitSubscriptionProof, resetSubscriptionState, checkSubscriptionStatus } from '../features/subscription/subscriptionSlice';
import { showToast } from '../features/common/uiSlice';

// Import des sous-composants (Nos 3 nouveaux fichiers)
import PlanSelection from './subscription/PlanSelection';
import PaymentUpload from './subscription/PaymentUpload';
import StatusView from './subscription/StatusView';

const WAVE_LINK_WEEKLY = import.meta.env.VITE_WAVE_LINK_WEEKLY || "https://wave.com/business/weekly";
const WAVE_LINK_MONTHLY = import.meta.env.VITE_WAVE_LINK_MONTHLY || "https://wave.com/business/monthly";
const IS_PROMO = import.meta.env.VITE_PROMO_MODE === 'true';

const SubscriptionPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dispatch = useDispatch();
  
  // États locaux et Redux
  const [step, setStep] = useState('SELECTION'); // SELECTION -> PENDING
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const { isLoading, isSuccess, error, subscriptionData, lastTransaction } = useSelector((state) => state.subscription);

  // Initialisation
  useEffect(() => { dispatch(checkSubscriptionStatus()); }, [dispatch]);

  // Gestion des notifications
  useEffect(() => {
    if (isSuccess) dispatch(showToast({ message: 'Preuve reçue ! Validation en cours...', type: 'success' }));
    if (error) {
      dispatch(showToast({ message: error, type: 'error' }));
      setTimeout(() => dispatch(resetSubscriptionState()), 3000);
    }
  }, [isSuccess, error, dispatch]);

  // Logique : Choix du plan
  const handlePlanSelect = (type) => {
    setSelectedPlan(type);
    const link = type === 'WEEKLY' ? WAVE_LINK_WEEKLY : WAVE_LINK_MONTHLY;
    window.open(link, '_blank');
    setStep('CONFIRMATION');
  };

  // Logique : Soumission formulaire
  const handleSubmitProof = (phone, file) => {
    const formData = new FormData();
    formData.append('type', selectedPlan);
    formData.append('paymentPhoneNumber', phone); // Match backend
    formData.append('proofImage', file);
    dispatch(submitSubscriptionProof(formData));
  };

  // DÉCISION DE L'AFFICHAGE (Le Cerveau)
  let content;
  const isActive = subscriptionData?.status === 'active';
  const isPending = isSuccess || lastTransaction?.status === 'PENDING';

  if (isActive) {
    content = <StatusView status="active" data={subscriptionData} />;
  } else if (isPending) {
    content = <StatusView status="pending" onRefresh={() => dispatch(checkSubscriptionStatus())} />;
  } else if (step === 'SELECTION') {
    content = <PlanSelection onSelectPlan={handlePlanSelect} />;
  } else {
    content = (
      <PaymentUpload 
        selectedPlan={selectedPlan} 
        onBack={() => setStep('SELECTION')} 
        onSubmit={handleSubmitProof}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 8, px: 2, background: isDark ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' : '#f5f7fa' }}>
      <Box maxWidth={900} mx="auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="900" gutterBottom>
              <span style={{ color: '#FFC107' }}>Y</span><span style={{ color: isDark ? '#fff' : '#000' }}>ély</span>
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>ABONNEMENT CHAUFFEUR</Typography>
            {IS_PROMO && <Chip label="🔥 PROMO ACTIVE -17%" color="error" sx={{ fontWeight: 'bold', mt: 1 }} />}
          </Box>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {content}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default SubscriptionPage;