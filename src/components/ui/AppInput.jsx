// src/components/ui/AppInput.jsx
import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { MuiTelInput } from 'mui-tel-input'; // On importe la librairie

const AppInput = ({ label, icon, type, value, onChange, name, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isTel = type === 'tel'; // On détecte si c'est un téléphone

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // --- CAS SPÉCIAL : TÉLÉPHONE (Avec Drapeaux) ---
  if (isTel) {
    return (
      <MuiTelInput
        value={value} // Le numéro actuel
        onChange={(newPhone) => {
          // Astuce : On simule un événement standard pour que RegisterPage ne soit pas perdu
          onChange({ target: { name: name, value: newPhone } });
        }}
        defaultCountry="CI" // 🇨🇮 Par défaut Côte d'Ivoire (Abidjan représente !)
        label={label}
        fullWidth
        forceCallingCode // Force l'affichage du +225
        focusOnSelectCountry // Focus quand on choisit un pays
        {...props}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3, // Arrondi comme les autres
            '&.Mui-focused fieldset': {
              borderColor: '#FFC107', // Jaune Yély
              borderWidth: 2
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#F57F17',
          }
        }}
      />
    );
  }

  // --- CAS NORMAL : TEXTE / EMAIL / PASSWORD ---
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      name={name} // Important de passer le name
      value={value} // Important de passer la value
      onChange={onChange}
      type={isPassword ? (showPassword ? 'text' : 'password') : type}
      {...props}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start" sx={{ color: 'text.secondary', mr: 1 }}>
            {icon}
          </InputAdornment>
        ) : null,
        
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              sx={{ color: 'text.secondary' }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,

        style: { borderRadius: 12 }
      }}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: '#FFC107',
            borderWidth: 2
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#F57F17',
        }
      }}
    />
  );
};

export default AppInput;