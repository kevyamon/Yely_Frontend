// src/components/ui/VehicleCarousel.jsx
import React, { useRef } from 'react';
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
    type: 'VIP',
    price: 5000,
    shortDesc: 'Seul à bord.',
    icon: <DiamondIcon />, 
    glow: 'rgba(255, 193, 7, 0.4)'
  },
  {
    id: 'premium',
    title: 'EXPRESS',
    type: 'EXPRESS',
    price: 2500,
    shortDesc: 'Prioritaire. Rapide.',
    icon: <BoltIcon />, 
    glow: 'rgba(0, 255, 255, 0.3)'
  },
  {
    id: 'classic',
    title: 'STANDARD',
    type: 'STANDARD',
    price: 1500,
    shortDesc: 'Partagé. Éco.',
    icon: <PersonIcon />, 
    glow: 'rgba(255, 255, 255, 0.2)'
  }
];

const VehicleCarousel = ({ onSelect, selectedId }) => {
  const containerRef = useRef(null);

  const handleCardClick = (service, index) => {
    onSelect(service); // On remonte l'objet complet au parent
    const container = containerRef.current;
    if (container) {
      const card = container.children[index];
      const scrollPosition = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  return (
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
          py: 1, // RÉDUIT (Était 2)
          width: '100%',
          px: 'calc(50vw - 65px)', 
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
            onClick={() => handleCardClick(service, index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default VehicleCarousel;