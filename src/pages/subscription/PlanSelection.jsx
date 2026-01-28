import React from 'react';
import { Box, Typography, CardContent, Chip, Avatar, Button, useTheme } from '@mui/material';
import { CalendarMonth, Diamond, CheckCircle, LocalOffer } from '@mui/icons-material';
import GlassCard from '../../components/ui/GlassCard'; // Import du nouveau composant

const IS_PROMO = import.meta.env.VITE_PROMO_MODE === 'true';

const PlanCard = ({ title, price, originalPrice, features, type, icon: Icon, isPopular, onSelect }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // Couleur du blob selon le type de carte
  const glowColor = isPopular ? '#FFC107' : (isDark ? '#4CAF50' : '#2196F3');

  return (
    <GlassCard 
      hoverEffect={true} 
      blobColor={glowColor} // C'est ici que la magie opère !
      onClick={() => onSelect(type)}
    >
      <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Badge Populaire */}
        {isPopular && (
          <Chip 
            label="RECOMMANDÉ" size="small"
            icon={<LocalOffer sx={{ color: '#000 !important', fontSize: '14px' }} />}
            sx={{ position: 'absolute', top: 20, right: 20, bgcolor: '#FFC107', color: '#000', fontWeight: '900', boxShadow: '0 4px 15px rgba(255, 193, 7, 0.4)' }}
          />
        )}
        
        {/* Icône */}
        <Box display="flex" alignItems="center" mb={3}>
          <Box sx={{ 
              width: 60, height: 60, borderRadius: '18px',
              background: `linear-gradient(135deg, ${glowColor}40 0%, ${glowColor}10 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${glowColor}40`, boxShadow: `0 8px 20px ${glowColor}30`
            }}>
            <Icon sx={{ fontSize: 30, color: isPopular ? '#FFC107' : (isDark ? '#fff' : '#333') }} />
          </Box>
        </Box>

        <Typography variant="h5" fontWeight="800" gutterBottom sx={{ opacity: 0.9 }}>{title}</Typography>

        {/* Prix */}
        <Box display="flex" alignItems="baseline" mb={4}>
          <Typography variant="h3" fontWeight="900" sx={{ 
            background: isPopular ? 'linear-gradient(to right, #FFC107, #FF9800)' : (isDark ? '#fff' : '#333'),
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            {price}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.6, ml: 1 }}>FCFA</Typography>
          {IS_PROMO && originalPrice && (
              <Box ml={2} position="relative">
                <Typography variant="body2" sx={{ textDecoration: 'line-through', opacity: 0.5 }}>{originalPrice}F</Typography>
                <Box sx={{ position: 'absolute', top: -10, right: -30, bgcolor: '#f44336', color: 'white', px: 0.8, py: 0.2, borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>-17%</Box>
              </Box>
          )}
        </Box>

        {/* Features */}
        <Box sx={{ flexGrow: 1, mb: 4 }}>
          {features.map((feature, idx) => (
            <Box key={idx} display="flex" alignItems="center" mb={2}>
              <CheckCircle sx={{ color: isPopular ? '#FFC107' : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'), mr: 1.5, fontSize: 20 }} />
              <Typography variant="body1" fontWeight="500" sx={{ opacity: 0.8 }}>{feature}</Typography>
            </Box>
          ))}
        </Box>

        <Button
          fullWidth variant="contained"
          sx={{
            py: 2, borderRadius: '16px', fontWeight: 'bold', fontSize: '1.1rem',
            background: isPopular ? 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
            color: isPopular ? '#000' : (isDark ? '#fff' : '#000'),
            boxShadow: isPopular ? '0 10px 20px rgba(255, 193, 7, 0.3)' : 'none',
            '&:hover': { background: isPopular ? '#FFD54F' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)') }
          }}
        >
          Choisir ce pass
        </Button>
      </CardContent>
    </GlassCard>
  );
};

const PlanSelection = ({ onSelectPlan }) => {
  return (
    <Box>
      <Box textAlign="center" mb={6}>
        <Typography variant="h6" sx={{ opacity: 0.6, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }} gutterBottom>Nos Offres Premium</Typography>
        <Typography variant="h3" fontWeight="900" sx={{ mb: 1 }}>Débloquez votre potentiel</Typography>
        <Typography variant="body1" sx={{ opacity: 0.6, maxWidth: 500, mx: 'auto' }}>Un investissement minime pour des gains illimités.</Typography>
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={4} px={{ xs: 1, md: 4 }}>
        <PlanCard 
          title="Pass Hebdo" price={IS_PROMO ? "1000" : "1200"} originalPrice={IS_PROMO ? "1200" : null}
          type="WEEKLY" icon={CalendarMonth} onSelect={onSelectPlan}
          features={["Accès complet 7 Jours", "0% de Commission", "Support Chauffeur 24/7", "Retraits Prioritaires"]} 
        />
        <PlanCard 
          title="Pass Mensuel" price={IS_PROMO ? "5000" : "6000"} originalPrice={IS_PROMO ? "6000" : null}
          type="MONTHLY" icon={Diamond} isPopular={true} onSelect={onSelectPlan}
          features={["Accès complet 30 Jours", "Badge 'Chauffeur Vérifié'", "Économisez 2 mois / an", "Accès aux courses V.I.P"]} 
        />
      </Box>
    </Box>
  );
};

export default PlanSelection;