import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PageHeader = ({ title, subtitle, icon }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      {icon && (
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 180, 216, 0.2))',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)',
            color: '#00ff88'
          }}
        >
          {icon}
        </Box>
      )}
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #00ff88, #00b4d8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader; 