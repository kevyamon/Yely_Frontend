// src/components/ui/ValidationCard.jsx
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

function ValidationCard({ transaction, onClick }) {
  const theme = useTheme();

  const planLabel = transaction.subscriptionType === 'WEEKLY' ? 'Hebdo' : 'Mensuel';
  const planColor = transaction.subscriptionType === 'WEEKLY' ? '#2196F3' : '#9C27B0';
  const planAmount = transaction.subscriptionType === 'WEEKLY' ? '1200F' : '6000F';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fff',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: 3,
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: '#FFD700',
            boxShadow: '0 8px 24px rgba(255, 215, 0, 0.2)',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            {/* Miniature Image */}
            <Box
              sx={{
                position: 'relative',
                width: 80,
                height: 80,
                flexShrink: 0,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                border: `2px solid ${planColor}`,
              }}
            >
              <img
                src={transaction.proofImageUrl}
                alt="Preuve"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80?text=IMG';
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  '&:hover': { opacity: 1 },
                }}
              >
                <ZoomInIcon sx={{ color: '#fff', fontSize: 30 }} />
              </Box>
            </Box>

            {/* Infos */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar
                  src={transaction.driver?.profilePicture}
                  sx={{ width: 32, height: 32 }}
                >
                  {transaction.driver?.name?.[0] || 'U'}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {transaction.driver?.name || 'Utilisateur'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                <Chip
                  label={`${planLabel} - ${planAmount}`}
                  size="small"
                  sx={{
                    bgcolor: `${planColor}22`,
                    color: planColor,
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                  }}
                />
                <Chip
                  icon={<PhoneIcon sx={{ fontSize: 14 }} />}
                  label={transaction.paymentPhone}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ValidationCard;