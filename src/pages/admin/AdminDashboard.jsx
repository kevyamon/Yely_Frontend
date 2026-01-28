// src/pages/admin/AdminDashboard.jsx

import React, { useEffect } from 'react';
import { Box, Grid, Paper, Typography, Avatar, useTheme } from '@mui/material';
import { 
  People, 
  DirectionsCar, 
  LocalTaxi, 
  AttachMoney,
  TrendingUp,
  PersonAdd
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminDashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        const response = await axios.get(`${BACKEND_URL}/api/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur fetch stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          background: isDark
            ? `linear-gradient(135deg, ${color}15 0%, rgba(0,0,0,0.4) 100%)`
            : `linear-gradient(135deg, ${color}10 0%, rgba(255,255,255,0.9) 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${color}30`,
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 8px 24px ${color}40`
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar
            sx={{
              bgcolor: `${color}20`,
              width: 56,
              height: 56
            }}
          >
            <Icon sx={{ color: color, fontSize: 28 }} />
          </Avatar>
        </Box>

        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ color: color }}>
          {loading ? '...' : value?.toLocaleString() || '0'}
        </Typography>

        <Typography variant="body2" color="text.secondary" fontWeight="600">
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </Paper>
    </motion.div>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vue d'ensemble de la plateforme Yély
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Passagers"
            value={stats?.totalRiders}
            icon={People}
            color="#2196F3"
            subtitle="Utilisateurs actifs"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Chauffeurs"
            value={stats?.totalDrivers}
            icon={DirectionsCar}
            color="#4CAF50"
            subtitle="Partenaires inscrits"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Courses"
            value={stats?.totalRides}
            icon={LocalTaxi}
            color="#FF9800"
            subtitle={`${stats?.completedRides || 0} terminées`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Chiffre d'Affaires"
            value={`${((stats?.totalRevenue || 0) / 1000).toFixed(0)}K`}
            icon={AttachMoney}
            color="#FFC107"
            subtitle={`Commission: ${((stats?.commission || 0) / 1000).toFixed(1)}K F`}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: isDark
                ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(0,0,0,0.4) 100%)'
                : 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(76,175,80,0.3)',
              borderRadius: '20px'
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <PersonAdd sx={{ color: '#4CAF50', mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Nouvelles inscriptions
              </Typography>
            </Box>
            <Typography variant="h2" fontWeight="900" color="#4CAF50">
              {loading ? '...' : stats?.newUsersLast24h || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dernières 24 heures
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: isDark
                ? 'linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(0,0,0,0.4) 100%)'
                : 'linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,193,7,0.3)',
              borderRadius: '20px'
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp sx={{ color: '#FFC107', mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Abonnements
              </Typography>
            </Box>
            <Box display="flex" gap={4}>
              <Box>
                <Typography variant="h3" fontWeight="900" color="#FFC107">
                  {loading ? '...' : stats?.weeklySubscriptions || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hebdomadaires
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="900" color="#FFC107">
                  {loading ? '...' : stats?.monthlySubscriptions || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mensuels
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;