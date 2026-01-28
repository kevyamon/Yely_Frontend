// src/components/ui/ValidationCard.jsx

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import {
  CalendarMonth,
  Diamond,
  Phone,
  AccessTime
} from '@mui/icons-material';

const ValidationCard = ({ transaction, onClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isWeekly = transaction.type === 'WEEKLY';
  const planColor = isWeekly ? '#2196F3' : '#9C27B0';
  const planIcon = isWeekly ? CalendarMonth : Diamond;
  const PlanIcon = planIcon;

  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          height: '100%',
          background: isDark
            ? 'linear-gradient(135deg, rgba(255,193,7,0.05) 0%, rgba(0,0,0,0.6) 100%)'
            : 'linear-gradient(135deg, rgba(255,193,7,0.08) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${planColor}30`,
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 8px 24px ${planColor}40`,
            borderColor: planColor
          }
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={transaction.proofImageUrl}
          alt="Preuve de paiement"
          sx={{
            objectFit: 'cover',
            borderBottom: `3px solid ${planColor}`
          }}
        />

        <CardContent sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  bgcolor: `${planColor}20`,
                  width: 40,
                  height: 40
                }}
              >
                <PlanIcon sx={{ color: planColor, fontSize: 24 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {transaction.driver?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {transaction.driver?.driverId}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            <Chip
              label={isWeekly ? 'Hebdo' : 'Mensuel'}
              size="small"
              sx={{
                bgcolor: `${planColor}20`,
                color: planColor,
                fontWeight: 'bold'
              }}
            />
            <Chip
              label={`${transaction.amount} F`}
              size="small"
              sx={{
                bgcolor: 'rgba(76,175,80,0.1)',
                color: '#4CAF50',
                fontWeight: 'bold'
              }}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {transaction.paymentPhoneNumber}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(transaction.createdAt)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ValidationCard;