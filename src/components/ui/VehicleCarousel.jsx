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
    shortDesc: 'Seul à bord.', // <--- MODIFICATION ICI (Plus de clim)
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
    // CONTENEUR "FULL BLEED"
    <Box sx={{ 
      width: '100vw', 
      position: 'relative',
      left: '50%', 
      right: '50%',
      marginLeft: '-50vw', 
      marginRight: '-50vw', 
    }}>
      <Box 
        ref={containerRef}
        sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          py: 2, 
          width: '100%',
          px: 'calc(50vw - 72px)', // Centrage
          '&::-webkit-scrollbar': { display: 'none' }, 
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