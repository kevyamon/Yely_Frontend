// src/components/ui/AppToast.jsx
import { Snackbar, Alert, AlertTitle, Slide } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../features/common/uiSlice';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

function AppToast() {
  const dispatch = useDispatch();
  const { toast } = useSelector((state) => state.ui);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    dispatch(hideToast());
  };

  // Extraire titre et message pour les erreurs
  const getDisplayContent = () => {
    const message = toast.message || '';
    const type = toast.type || 'info';

    // Si c'est PAS une erreur, on retourne tel quel
    if (type !== 'error') {
      return { title: null, message };
    }

    // Gestion des erreurs avec titres
    if (message.includes('401') || message.includes('Unauthorized')) {
      return { title: '🔒 Accès refusé', message: 'Vous devez vous reconnecter' };
    }
    if (message.includes('incorrect')) {
      return { title: null, message }; // On garde le message tel quel
    }
    if (message.includes('403') || message.includes('Forbidden')) {
      return { title: '⛔ Action non autorisée', message: 'Vous n\'avez pas les droits' };
    }
    if (message.includes('404') || message.includes('Not Found')) {
      return { title: '🔍 Introuvable', message: 'Élément introuvable' };
    }
    if (message.includes('500') || message.includes('Server Error')) {
      return { title: '⚠️ Erreur serveur', message: 'Problème technique. Réessayez' };
    }
    if (message.includes('Network Error') || message.includes('timeout')) {
      return { title: '📡 Connexion', message: 'Vérifiez votre internet' };
    }

    return { title: null, message };
  };

  const { title, message } = getDisplayContent();

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={toast.type === 'error' ? 6000 : 4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
      sx={{ mt: 2 }}
    >
      <Alert
        onClose={handleClose}
        severity={toast.type}
        variant="filled"
        sx={{
          width: '100%',
          minWidth: { xs: '90vw', sm: '400px' },
          maxWidth: '600px',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          fontSize: '1rem',
          '& .MuiAlert-icon': {
            fontSize: '28px',
          },
        }}
      >
        {title && (
          <AlertTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {title}
          </AlertTitle>
        )}
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AppToast;