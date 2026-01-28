// src/pages/admin/FinancePage.jsx

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  useTheme
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  AccountBalance,
  Settings
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const FinancePage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { user } = useSelector((state) => state.auth);

  const superAdminEmail = import.meta.env.VITE_ADMIN_MAIL;
  const isSuperAdmin = user?.email === superAdminEmail;

  if (!isSuperAdmin) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          ⛔ Accès refusé - SuperAdmin uniquement
        </Typography>
      </Box>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: isDark
          ? `linear-gradient(135deg, ${color}15 0%, rgba(0,0,0,0.4) 100%)`
          : `linear-gradient(135deg, ${color}10 0%, rgba(255,255,255,0.9) 100%)`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${color}30`,
        borderRadius: '20px'
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar sx={{ bgcolor: `${color}20`, width: 56, height: 56 }}>
          <Icon sx={{ color: color, fontSize: 28 }} />
        </Avatar>
      </Box>
      <Typography variant="h4" fontWeight="900" sx={{ color: color }} gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight="600">
        {title}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          Finance & Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestion financière et paramètres système (SuperAdmin)
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Chiffre d'Affaires Total"
            value="0 F"
            icon={AttachMoney}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Commission (10%)"
            value="0 F"
            icon={TrendingUp}
            color="#FFC107"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Abonnements Actifs"
            value="0"
            icon={AccountBalance}
            color="#2196F3"
          />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: isDark
            ? 'rgba(0,0,0,0.4)'
            : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,193,7,0.2)',
          mb: 3
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Settings sx={{ color: '#FFC107', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Mode Promotion
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Switch
              defaultChecked={import.meta.env.VITE_IS_PROMO_ACTIVE === 'true'}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#FFC107',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  bgcolor: '#FFC107',
                },
              }}
            />
          }
          label={
            <Box>
              <Typography variant="body1" fontWeight="bold">
                Activer le mode promo (-17%)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hebdo : 1000F au lieu de 1200F • Mensuel : 5000F au lieu de 6000F
              </Typography>
            </Box>
          }
        />

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" fontWeight="bold" mb={2}>
          Liens de paiement Wave
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Lien Hebdomadaire"
              defaultValue={import.meta.env.VITE_WAVE_LINK_WEEKLY || ''}
              disabled
              helperText="SuperAdmin uniquement"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Lien Mensuel"
              defaultValue={import.meta.env.VITE_WAVE_LINK_MONTHLY || ''}
              disabled
              helperText="Partenaire (AirMax)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px'
                }
              }}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button
            variant="contained"
            disabled
            sx={{
              bgcolor: '#FFC107',
              color: '#000',
              fontWeight: 'bold',
              borderRadius: '12px',
              px: 4,
              '&:hover': {
                bgcolor: '#FFD54F'
              }
            }}
          >
            SAUVEGARDER LES MODIFICATIONS
          </Button>
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            💡 Les modifications nécessitent un redéploiement de l'application
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default FinancePage;