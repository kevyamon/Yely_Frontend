// src/pages/admin/FinancePage.jsx

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  TextField,
  Button,
  FormControlLabel,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Save,
  AttachMoney,
  Link as LinkIcon,
  LocalFireDepartment,
  TrendingUp,
  CreditCard
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { showToast } from '../../features/common/uiSlice';

const FinancePage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isDark = theme.palette.mode === 'dark';

  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  
  // États du formulaire
  const [promoMode, setPromoMode] = useState(false);
  const [weeklyLink, setWeeklyLink] = useState('');
  const [monthlyLink, setMonthlyLink] = useState('');
  
  // États des Stats (Fictif pour l'instant, à connecter plus tard)
  const stats = {
    totalRevenue: 1450000,
    monthlyRevenue: 320000,
    activeSubscriptions: 85
  };

  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
      'Authorization': `Bearer ${user?.token}`,
    },
  });

  // 1. Charger la config actuelle (Simulation pour l'instant)
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setConfigLoading(true);
      // TODO: Créer la route backend GET /api/admin/config
      // Pour l'instant on simule une réponse API ou on utilise les variables d'env par défaut
      // const { data } = await apiClient.get('/api/admin/config');
      
      // Simulation des valeurs actuelles
      setPromoMode(false); // Par défaut OFF
      setWeeklyLink(import.meta.env.VITE_WAVE_LINK_WEEKLY || '');
      setMonthlyLink(import.meta.env.VITE_WAVE_LINK_MONTHLY || '');
      
    } catch (error) {
      console.error('Erreur config:', error);
      dispatch(showToast({ message: 'Impossible de charger la configuration', type: 'error' }));
    } finally {
      setConfigLoading(false);
    }
  };

  // 2. Sauvegarder les changements
  const handleSaveConfig = async () => {
    try {
      setLoading(true);
      // TODO: Créer la route backend POST /api/admin/config
      // await apiClient.post('/api/admin/config', { 
      //   promoMode, 
      //   weeklyLink, 
      //   monthlyLink 
      // });

      // Simulation de réussite
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(showToast({ 
        message: '✅ Configuration mise à jour avec succès !', 
        type: 'success' 
      }));
    } catch (error) {
      dispatch(showToast({ message: 'Erreur lors de la sauvegarde', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  if (configLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FFC107' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="900" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          Finance & Config <AttachMoney fontSize="large" sx={{ color: '#FFC107' }} />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestion de la trésorerie et des paramètres de paiement
        </Typography>
      </Box>

      {/* Section KPIs Financiers */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: '16px', background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 1 }}>REVENU TOTAL (Est.)</Typography>
            <Typography variant="h4" fontWeight="bold">{stats.totalRevenue.toLocaleString()} F</Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp fontSize="small" /> <Typography variant="caption">+12% ce mois</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid rgba(255,193,7,0.2)', bgcolor: isDark ? '#1E1E1E' : 'white' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>ABONNEMENTS ACTIFS</Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">{stats.activeSubscriptions}</Typography>
            <Typography variant="caption" color="text.secondary">Chauffeurs en règle</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Section Configuration */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: '20px', 
              border: `1px solid ${promoMode ? '#f44336' : 'rgba(255,255,255,0.1)'}`,
              background: isDark ? '#151515' : 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Effet visuel Mode Promo */}
            {promoMode && (
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', bgcolor: '#f44336', boxShadow: '0 0 10px #f44336' }} />
            )}

            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon color="action" /> Configuration des Paiements
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Modifiez ici les liens Wave Business utilisés dans l'application chauffeur.
            </Typography>

            <Box component="form" sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* INTERRUPTEUR MODE PROMO */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  borderColor: promoMode ? '#f44336' : 'divider',
                  bgcolor: promoMode ? 'rgba(244, 67, 54, 0.05)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={promoMode}
                      onChange={(e) => setPromoMode(e.target.checked)}
                      color="error"
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: promoMode ? '#f44336' : 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                        ACTIVER LE MODE PROMO {promoMode && <LocalFireDepartment fontSize="small" className="animate-pulse" />}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Si activé, les chauffeurs verront les tarifs réduits et les prix barrés.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* CHAMPS DE LIENS */}
              <TextField
                label="Lien Wave - Forfait Hebdomadaire (SuperAdmin)"
                value={weeklyLink}
                onChange={(e) => setWeeklyLink(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><CreditCard /></InputAdornment>,
                }}
                helperText="Caisse Direction (1200F / 1000F Promo)"
              />

              <TextField
                label="Lien Wave - Forfait Mensuel (Admin Partenaire)"
                value={monthlyLink}
                onChange={(e) => setMonthlyLink(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><CreditCard /></InputAdornment>,
                }}
                helperText="Caisse Partenaire (6000F / 5000F Promo)"
              />

              <Button
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSaveConfig}
                disabled={loading}
                sx={{ 
                  mt: 2, 
                  bgcolor: '#FFC107', 
                  color: 'black', 
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#FFB300' }
                }}
              >
                {loading ? 'Sauvegarde...' : 'Enregistrer la configuration'}
              </Button>

            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Alert severity="info" sx={{ borderRadius: '16px', mb: 3 }}>
            <strong>Note de sécurité :</strong><br/>
            Seul le SuperAdmin peut modifier ces liens. Toute modification est immédiate pour tous les chauffeurs.
          </Alert>
          
          <Alert severity="warning" sx={{ borderRadius: '16px' }}>
            <strong>Attention :</strong><br/>
            Vérifiez toujours que les liens Wave fonctionnent avant de les mettre à jour. Un lien mort = Perte d'argent.
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancePage;