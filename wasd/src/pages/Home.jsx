import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Stack,
  Divider,
  useTheme,
  alpha,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import { 
  TrendingUpRounded, 
  AssessmentRounded, 
  PriceCheckRounded,
  RocketLaunchRounded,
  Close as CloseIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  CodeRounded,
  SecurityRounded,
  DesignServicesRounded,
  BusinessRounded,
  BuildRounded,
  SpeedRounded,
  TimelineRounded,
  AnalyticsRounded,
  ArrowForwardRounded,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

// Import our custom components
import AdvancedBackground from '../components/AdvancedBackground';
import GlassCard from '../components/GlassCard';
import TransactionTicker from '../components/TransactionTicker';
import TransactionChart from '../components/TransactionChart';

// About Us Dialog Component
const AboutUsDialog = ({ open, onClose }) => {
  const dialogRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        style: {
          background: 'rgba(10, 10, 30, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        ref: dialogRef
      }}
    >
      <DialogTitle sx={{ 
        color: 'white', 
        pb: 0, 
        pt: 3, 
        background: 'linear-gradient(45deg, #00ff88, #00b4d8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
        fontSize: '2rem',
        textAlign: 'center'
      }}>
        About Blocc
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ color: 'white', py: 4 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
          Revolutionizing blockchain transactions with cutting-edge technology
        </Typography>
        
        <Box sx={{ mb: 5 }}>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
            Blocc is a next-generation blockchain transaction platform designed to make cryptocurrency 
            trading seamless, secure, and transparent. Our mission is to bridge the gap between complex 
            blockchain technology and everyday users, providing a frictionless experience for managing 
            digital assets.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
            Founded in 2023, our team combines expertise in blockchain development, security, design, 
            and project management to create a platform that stands above the rest. We're committed 
            to innovation, security, and user empowerment.
          </Typography>
        </Box>
        
        <Typography variant="h5" sx={{ 
          mb: 4, 
          textAlign: 'center',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #00ff88, #00b4d8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Meet Our Team
        </Typography>
        
        <Grid container spacing={3}>
          {/* Placeholder for team member cards */}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Paper sx={{ 
      height: '100%', 
      bgcolor: 'rgba(0,0,0,0.4)', 
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      p: 3,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box 
        sx={{ 
          position: 'absolute', 
          right: -20, 
          top: -20, 
          fontSize: '140px', 
          opacity: 0.05,
          transform: 'rotate(15deg)',
          color: '#00ff88'
        }}
      >
        {icon}
      </Box>
      
      <Box 
        sx={{ 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1.5,
          borderRadius: '12px',
          bgcolor: 'rgba(0, 255, 136, 0.1)',
          color: '#00ff88',
          mb: 2
        }}
      >
        {icon}
      </Box>
      
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      
      <Button 
        endIcon={<ArrowForwardRounded />} 
        sx={{ 
          color: '#00ff88',
          '&:hover': {
            bgcolor: 'rgba(0, 255, 136, 0.1)',
          }
        }}
      >
        Learn More
      </Button>
    </Paper>
  </motion.div>
);

// Hero Section
const HeroSection = () => {
  const [account, setAccount] = useState(null);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Check if MetaMask is installed and account is connected
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum !== undefined) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        })
        .catch(error => {
          console.error('Error checking accounts:', error);
        });
    }
  }, []);

  // Handle Get Started button click
  const handleGetStarted = async () => {
    if (account) {
      // If already connected, navigate to wallet page
      navigate('/wallet');
    } else {
      // If not connected, try to connect
      if (typeof window !== 'undefined' && window.ethereum !== undefined) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            navigate('/wallet');
          }
        } catch (error) {
          console.error('Error connecting wallet:', error);
        }
      } else {
        // MetaMask not installed
        window.open('https://metamask.io/download/', '_blank');
      }
    }
  };

  return (
    <Box sx={{ 
      minHeight: '70vh', 
      display: 'flex', 
      alignItems: 'center',
      mb: 8,
      position: 'relative'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography 
                variant="h1" 
                fontWeight="900" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  background: 'linear-gradient(90deg, #00ff88, #00b4d8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-1px',
                  textShadow: '0 0 30px rgba(0, 255, 136, 0.3)'
                }}
              >
                CMMS MATRIX
              </Typography>
              
              <Typography 
                variant="h2" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  mb: 3
                }}
              >
                Computerized Maintenance Management System
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph 
                color="text.secondary"
                sx={{ mb: 4, maxWidth: '90%' }}
              >
                Streamline your maintenance operations with our powerful CMMS solution. 
                Monitor equipment health, schedule preventive maintenance, and optimize 
                resources with our intuitive platform.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link}
                  to="/dashboard"
                  sx={{ 
                    py: 1.5, 
                    px: 3,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    bgcolor: '#00ff88',
                    color: '#000000',
                    '&:hover': {
                      bgcolor: '#00cc6a',
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    px: 3,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    borderColor: '#00ff88',
                    color: '#00ff88',
                    '&:hover': {
                      borderColor: '#00ff88',
                      bgcolor: 'rgba(0, 255, 136, 0.1)',
                    }
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Box 
                sx={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  bgcolor: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  p: 2,
                  boxShadow: '0 20px 80px rgba(0, 255, 136, 0.2)',
                  position: 'relative',
                  height: { xs: 300, md: 400 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Matrix code rain effect (simplified version) */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ 
                      y: 500, 
                      opacity: [0, 1, 0],
                      transition: {
                        repeat: Infinity,
                        duration: 3 + Math.random() * 5,
                        delay: Math.random() * 2
                      }
                    }}
                    style={{
                      position: 'absolute',
                      color: '#00ff88',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      left: `${(i * 3) + Math.random() * 10}%`,
                      userSelect: 'none'
                    }}
                  >
                    {Math.random() > 0.5 ? '1' : '0'}
                  </motion.div>
                ))}
                
                {/* Overlay text on the matrix rain */}
                <Box sx={{ 
                  position: 'relative', 
                  zIndex: 2, 
                  textAlign: 'center',
                  p: 3,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  borderRadius: '8px'
                }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Maintenance Simplified
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A modern approach to facility and equipment management
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Live Transactions Section
const LiveTransactionsSection = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ py: 8, background: alpha(theme.palette.background.paper, 0.3) }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                mb: 1,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Live Transactions
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 2, maxWidth: 800, mx: 'auto' }}
            >
              Watch blockchain transactions happening in real-time
            </Typography>
            <Divider 
              sx={{ 
                width: '80px', 
                mx: 'auto', 
                mb: 4, 
                borderColor: 'rgba(0, 255, 136, 0.5)' 
              }} 
            />
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <GlassCard delay={0.1}>
              <Typography variant="h6" gutterBottom>
                Transaction Volume
              </Typography>
              <Box sx={{ height: 350 }}>
                <TransactionChart />
              </Box>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={5}>
            <GlassCard delay={0.2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Recent Transactions
                </Typography>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '50px',
                    bgcolor: 'rgba(0, 255, 136, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#00ff88',
                      mr: 1,
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%': {
                          boxShadow: '0 0 0 0 rgba(0, 255, 136, 0.4)',
                        },
                        '70%': {
                          boxShadow: '0 0 0 6px rgba(0, 255, 136, 0)',
                        },
                        '100%': {
                          boxShadow: '0 0 0 0 rgba(0, 255, 136, 0)',
                        },
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 'medium' }}>
                    Live
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 350, overflow: 'auto' }}>
                <TransactionTicker />
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const FeaturesSection = () => (
  <Box sx={{ py: 8 }}>
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Our CMMS solution provides everything you need to streamline maintenance operations
          and improve equipment reliability.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={3}>
          <FeatureCard 
            icon={<BuildRounded />} 
            title="Asset Management" 
            description="Track all equipment details, maintenance history, and documentation in one central location."
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <FeatureCard 
            icon={<SpeedRounded />} 
            title="Preventive Maintenance" 
            description="Schedule recurring maintenance tasks based on time intervals or equipment usage metrics."
            delay={0.3}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <FeatureCard 
            icon={<TimelineRounded />} 
            title="Work Order Management" 
            description="Create, assign, prioritize, and track maintenance work orders through completion."
            delay={0.5}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <FeatureCard 
            icon={<AnalyticsRounded />} 
            title="Analytics & Reporting" 
            description="Gain insights through customizable reports, dashboards, and performance metrics."
            delay={0.7}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const CtaSection = () => (
  <Box sx={{ py: 10 }}>
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,30,20,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 20px 80px rgba(0, 255, 136, 0.15)'
        }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Transform your maintenance operations with our powerful CMMS solution.
            Experience improved reliability, reduced downtime, and enhanced efficiency.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/dashboard"
            sx={{ 
              py: 1.5, 
              px: 4,
              borderRadius: '8px',
              fontSize: '1.1rem',
              bgcolor: '#00ff88',
              color: '#000000',
              '&:hover': {
                bgcolor: '#00cc6a',
              }
            }}
          >
            Explore the Dashboard
          </Button>
        </Paper>
      </motion.div>
    </Container>
  </Box>
);

const Home = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 8 }}>
      <AdvancedBackground />
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </Box>
  );
};

export default Home; 