// src/components/ui/RideRequestModal.jsx
import React from 'react';
import { Box, Typography, Button, Modal, Backdrop, Fade, InputBase, Paper, IconButton, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const RideRequestModal = ({ open, onClose, destination, setDestination, suggestions, onSelect, onConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ sx: { backdropFilter: 'blur(10px)', bgcolor: 'rgba(0,0,0,0.4)' } }}
    >
      <Fade in={open}>
        <Box sx={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '90%', maxWidth: 400, bgcolor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)',
          borderRadius: '24px', p: 4, outline: 'none', border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <Typography variant="h5" fontWeight="900" textAlign="center" mb={3}>On va où ? ✨</Typography>
          
          <Paper sx={{ display: 'flex', alignItems: 'center', p: 1, px: 2, borderRadius: '16px', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.1)' }}>
            <SearchIcon sx={{ color: '#FFC107', mr: 1 }} />
            <InputBase 
                placeholder="Destination à Maféré..." 
                fullWidth 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
                sx={{ fontWeight: 'bold' }} 
            />
            {destination && <IconButton size="small" onClick={() => setDestination('')}><CloseIcon fontSize="small" /></IconButton>}
          </Paper>

          {/* SUGGESTIONS */}
          <Box sx={{ maxHeight: 200, overflowY: 'auto', mt: 1 }}>
            <List>
              {suggestions.map((p, i) => (
                <ListItemButton key={i} onClick={() => onSelect(p)} sx={{ borderRadius: 2 }}>
                  <ListItemIcon><LocationOnIcon sx={{ color: '#FFC107' }} /></ListItemIcon>
                  <ListItemText primary={p.main_text} secondary={p.secondary_text} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          <Button 
            fullWidth 
            variant="contained" 
            size="large" 
            disabled={!destination}
            onClick={onConfirm}
            sx={{ mt: 3, py: 2, borderRadius: '16px', bgcolor: '#FFC107', color: 'black', fontWeight: '900' }}
          >
            COMMANDER
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RideRequestModal;