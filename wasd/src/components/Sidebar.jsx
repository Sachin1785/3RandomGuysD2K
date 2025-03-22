import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Drawer, Tooltip, Paper, ListItemButton, alpha, Button } from '@mui/material';
import { 
  Dashboard, 
  CalendarToday, 
  Assignment, 
  BarChart, 
  Assessment, 
  Report,
  Settings,
  Construction,
  Build,
  DataUsage,
  Home as HomeIcon,
  CorporateFare as FacilityIcon,
  Schedule as ScheduleIcon,
  Warning as RiskIcon,
  TrendingUp as TrendIcon,
  People as ResourceIcon,
  SmartToy as AskAIIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const drawerWidth = 260;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Task Management', icon: <Assignment />, path: '/taskoverview' },
  { text: 'Facility Overview', icon: <FacilityIcon />, path: '/facility' },
  { text: 'Maintenance', icon: <Build />, path: '/maintenance' },
  { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
  { text: 'Ask AI', icon: <AskAIIcon />, path: '/askai' },
  { text: 'Resource Allocation', icon: <ResourceIcon />, path: '/resources' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  
  // Matrix-style binary animation
  const MatrixBinary = () => {
    return (
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, overflow: 'hidden', opacity: 0.2, pointerEvents: 'none' }}>
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: 100, 
              opacity: [0, 1, 0],
              transition: { 
                repeat: Infinity, 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2
              }
            }}
            style={{
              position: 'absolute',
              left: `${index * 10 + Math.random() * 10}%`,
              color: '#00ff88',
              fontSize: '10px',
              fontFamily: 'monospace'
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </motion.div>
        ))}
      </Box>
    );
  };

  // Neon glow effect for active menu item
  const getItemStyles = (path) => {
    const isActive = location.pathname === path;
    
    return {
      borderLeft: isActive ? '4px solid' : '4px solid transparent',
      transition: 'all 0.3s',
      my: 0.5,
      mx: 1,
      borderRadius: '0 8px 8px 0',
      '&:hover': {
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
      },
      ...(isActive && {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
      }),
    };
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          background: 'rgba(10, 10, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          pt: 2,
          position: 'fixed',
          height: '100%',
          overflowY: 'auto'
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #00ff88, #00b4d8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}
        >
          CMMS MATRIX
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Facility Management System
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
      
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: '10px',
                backgroundColor: location.pathname === item.path ? 
                  alpha('#00ff88', 0.15) : 'transparent',
                '&:hover': {
                  backgroundColor: alpha('#00ff88', 0.1),
                },
                transition: 'none'
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? '#00ff88' : 'inherit',
                minWidth: '40px'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.95rem',
                  fontWeight: location.pathname === item.path ? 'medium' : 'regular',
                  color: location.pathname === item.path ? '#fff' : 'inherit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', mb: 2 }} />
        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: '10px',
            py: 1,
            bgcolor: 'rgba(0, 255, 136, 0.15)',
            color: '#00ff88',
            '&:hover': {
              bgcolor: 'rgba(0, 255, 136, 0.25)',
            },
            transition: 'none'
          }}
        >
          Get Support
        </Button>
      </Box>
      
      {/* Matrix animation */}
      <MatrixBinary />
    </Drawer>
  );
};

export default Sidebar; 