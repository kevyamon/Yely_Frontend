// src/components/ui/VehicleCarousel.jsx
import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import VehicleCard from './VehicleCard';

// ICÔNES
import DiamondIcon from '@mui/icons-material/Diamond';
import BoltIcon from '@mui/icons-material/Bolt';
import PersonIcon from '@mui/icons-material/Person';

const SERVICES = [
  {
    id: 'vip',
    title: 'VIP',
    shortDesc: 'Seul à bord. Climatisation.',
    icon: <DiamondIcon sx={{ fontSize: 32 }} />, 
    glow: 'rgba(255, 193, 7, 0.4)'
  },
  {
    id: 'premium',
    title: 'EXPRESS',
    shortDesc: 'Prioritaire. Rapide.',
    icon: <BoltIcon sx={{ fontSize: 32 }} />, 
    glow: 'rgba(0, 255, 255, 0.3)'
  },
  {
    id: 'classic',
    title: 'STANDARD',
    shortDesc: 'Partagé. Éco.',
    icon: <PersonIcon sx={{ fontSize: 32 }} />, 
    glow: 'rgba(255, 255, 255, 0.2)'
  }
];

const VehicleCarousel = () => {
  const [selectedId, setSelectedId] = useState('classic');
  const containerRef = useRef(null);

  const handleCardClick = (id, index) => {
    setSelectedId(id);
    const container = containerRef.current;
    if (container) {
      const card = container.children[index];
      // Centrage mathématique parfait
      const scrollPosition = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  return (
    // 1. LE CONTENEUR "FULL BLEED" (L'astuce est ici)
    <Box sx={{ 
      width: '100vw', // Prend toute la largeur de l'écran
      position: 'relative',
      left: '50%', 
      right: '50%',
      marginLeft: '-50vw', // On tire vers la gauche
      marginRight: '-50vw', // On tire vers la droite
    }}>
      <Box 
        ref={containerRef}
        sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          py: 2, 
          width: '100%',
          
          // 2. CENTRAGE PRÉCIS DU PREMIER ÉLÉMENT
          // 50vw (Milieu écran) - 72px (Moitié largeur carte approx + marge)
          px: 'calc(50vw - 72px)', 
          
          '&::-webkit-scrollbar': { display: 'none' }, // Cache scrollbar
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth'
        }}
      >
        {SERVICES.map((service, index) => (
          <VehicleCard
            key={service.id}
            vehicle={service}
            isSelected={selectedId === service.id}
            onClick={() => handleCardClick(service.id, index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default VehicleCarousel;