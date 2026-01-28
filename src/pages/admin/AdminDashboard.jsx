// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

function AdminDashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Erreur stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Chauffeurs Actifs',
      value: stats?.activeDrivers || 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#4CAF50',
      bgGradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
    },
    {
      title: 'En Attente',
      value: stats?.pendingValidations || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#FF9800',
      bgGradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
    },
    {
      title: 'Validés Aujourd\'hui',
      value: stats?.validatedToday || 0,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#2196F3',
      bgGradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
    },
    {
      title: 'CA Total',
      value: `${stats?.totalRevenue || 0} F`,
      icon: <MoneyIcon sx={{ fontSize: 40 }} />,
      color: '#FFD700',
      bgGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📊 Tableau de bord
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vue d'ensemble de votre plateforme Yély
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fff',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                {/* Gradient Background */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    background: card.bgGradient,
                    opacity: 0.2,
                    borderRadius: '0 0 0 100%',
                  }}
                />

                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {card.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: card.color }}>
                        {card.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: card.bgGradient,
                        color: '#fff',
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Box sx={{ mt: 4 }}>
        <Paper
          sx={{
            p: 3,
            background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fff',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📈 Activité récente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Les dernières validations et actions effectuées sur la plateforme
          </Typography>
          {/* TODO: Ajouter liste activités */}
        </Paper>
      </Box>
    </Box>
  );
}

export default AdminDashboard;