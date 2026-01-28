// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, useTheme, Avatar } from '@mui/material';
import { Users, TrendingUp, AlertCircle, Car, DollarSign } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import GlassCard from '../../components/ui/GlassCard'; // Notre composant magique
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    pendingValidations: 0,
    activeDrivers: 0,
    totalUsers: 0,
    revenue: 0 // (Fictif pour l'instant)
  });

  // Simulation chargement stats (à connecter au vrai endpoint plus tard)
  useEffect(() => {
    // Ici tu feras: const { data } = await axios.get('/api/admin/dashboard/stats');
    // Pour l'effet visuel immédiat :
    setStats({
      pendingValidations: 3, // Exemple
      activeDrivers: 12,
      totalUsers: 145,
      revenue: 125000
    });
  }, []);

  // Configuration des cartes de stats
  const statCards = [
    { 
      title: 'Validations en attente', 
      value: stats.pendingValidations, 
      icon: <AlertCircle size={28} color="white" />, 
      color: '#ff4444', // Rouge urgent
      blob: true // On veut l'effet liquide ici !
    },
    { 
      title: 'Chauffeurs Actifs', 
      value: stats.activeDrivers, 
      icon: <Car size={28} color="white" />, 
      color: '#4CAF50', // Vert succès
      blob: false 
    },
    { 
      title: 'Revenu Mensuel', 
      value: `${stats.revenue.toLocaleString()} F`, 
      icon: <DollarSign size={28} color="white" />, 
      color: '#FFC107', // Or argent
      blob: true // Effet liquide aussi pour l'argent
    },
    { 
      title: 'Total Utilisateurs', 
      value: stats.totalUsers, 
      icon: <Users size={28} color="white" />, 
      color: '#2196F3', // Bleu standard
      blob: false 
    },
  ];

  return (
    <Box>
      {/* En-tête avec Salutations */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ color: 'white', mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Bienvenue dans la tour de contrôle, <span style={{ color: '#FFC107', fontWeight: 'bold' }}>{user?.name}</span>.
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '2px' }}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      {/* Grille des Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <GlassCard 
              hoverEffect={true}
              blobColor={stat.blob ? stat.color : null} // Active le blob si demandé
              sx={{ height: '100%' }}
            >
              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, borderRadius: '14px', 
                    bgcolor: `${stat.color}20`, // Couleur transparente
                    border: `1px solid ${stat.color}40`,
                    boxShadow: `0 0 20px ${stat.color}20`
                  }}>
                    {stat.icon}
                  </Box>
                  {index === 0 && stats.pendingValidations > 0 && (
                    <Box 
                      component={motion.div} 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff4444', boxShadow: '0 0 10px #ff4444' }} 
                    />
                  )}
                </Box>
                
                <Box sx={{ mt: 'auto' }}>
                  <Typography variant="h3" fontWeight="900" sx={{ color: 'white', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      {/* Zone Vide pour le futur (Graphiques) - Avec GlassCard aussi ! */}
      <GlassCard sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center" sx={{ opacity: 0.5 }}>
          <TrendingUp size={48} style={{ marginBottom: 16 }} />
          <Typography variant="h6">Graphiques d'activité en temps réel</Typography>
          <Typography variant="body2">Bientôt disponible dans la v2</Typography>
        </Box>
      </GlassCard>

    </Box>
  );
};

export default AdminDashboard;