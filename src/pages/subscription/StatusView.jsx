import React from 'react';
import { Typography, Box, Button, Chip, CircularProgress } from '@mui/material';
import { Verified, AccessTime, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard'; // Import magique

const StatusView = ({ status, data, onRefresh }) => {
  const navigate = useNavigate();
  const isPending = status === 'pending';
  const glowColor = isPending ? '#2196F3' : '#4CAF50';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Box sx={{ maxWidth: 500, mx: 'auto' }}>
        <GlassCard blobColor={glowColor} sx={{ textAlign: 'center' }}>
          
          <Box sx={{ p: 5 }}>
            {/* Icône Animée */}
            <motion.div 
              animate={isPending ? {} : { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Box sx={{
                  width: 100, height: 100, mx: 'auto', mb: 3, borderRadius: '30px',
                  background: `linear-gradient(135deg, ${glowColor}40 0%, ${glowColor}10 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${glowColor}40`, boxShadow: `0 10px 30px ${glowColor}30`
                }}>
                {isPending ? <CircularProgress size={50} sx={{ color: glowColor }} /> : <Verified sx={{ fontSize: 50, color: glowColor }} />}
              </Box>
            </motion.div>
            
            <Typography variant="h4" fontWeight="900" gutterBottom sx={{ 
              background: isPending ? 'linear-gradient(to right, #2196F3, #03A9F4)' : 'linear-gradient(to right, #4CAF50, #8BC34A)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {isPending ? 'Vérification...' : 'Compte Actif ✨'}
            </Typography>
            
            <Typography variant="body1" sx={{ opacity: 0.7, mb: 4, fontSize: '1.1rem' }}>
              {isPending 
                ? "Votre preuve est chez notre équipe. Accès dans 10 min max."
                : <>Profitez de votre pass <Chip label={data?.plan === 'WEEKLY' ? 'Hebdo' : 'Mensuel'} size="small" color="success" sx={{ fontWeight: 'bold' }} /> en illimité.</>
              }
            </Typography>

            {isPending ? (
              <Button size="large" startIcon={<AccessTime />} onClick={onRefresh} sx={{ color: glowColor, fontWeight: 'bold', borderRadius: '12px', background: `${glowColor}10`, '&:hover': { background: `${glowColor}20` } }}>
                Vérifier le statut
              </Button>
            ) : (
              <Box sx={{ p: 3, background: `linear-gradient(135deg, ${glowColor}20 0%, ${glowColor}05 100%)`, borderRadius: '20px', mb: 4, border: `1px solid ${glowColor}20` }}>
                <Typography variant="h2" fontWeight="900" sx={{ color: glowColor }}>
                  {data?.remainingHours ? `${Math.ceil(data.remainingHours / 24)}j` : 'Actif'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Temps restant estimé</Typography>
              </Box>
            )}

            {!isPending && (
              <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/home')} sx={{ mt: 4, borderColor: glowColor, color: glowColor, fontWeight: 'bold', borderRadius: '12px', px: 4, py: 1.5, borderWidth: '2px', '&:hover': { borderColor: glowColor, background: `${glowColor}10`, borderWidth: '2px' } }}>
                Retour à l'accueil
              </Button>
            )}
          </Box>
          
        </GlassCard>
      </Box>
    </motion.div>
  );
};

export default StatusView;