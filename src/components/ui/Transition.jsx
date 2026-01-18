// src/components/ui/Transition.jsx
import React, { forwardRef } from 'react';
import { Slide } from '@mui/material';

// On utilise le composant Slide natif de MUI qui est plus stable avec Dialog
// au lieu de forcer framer-motion directement dans les props du Dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default Transition;