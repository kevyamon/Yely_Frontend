// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

// Ce hook retarde la mise à jour d'une valeur
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // On lance un timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si l'utilisateur tape encore avant la fin du timer, on annule le précédent !
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}