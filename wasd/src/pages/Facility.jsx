import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button,
  Divider,
  Stack,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Menu,
  MenuItem,
  LinearProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  Build as BuildIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import GlassCard from '../components/GlassCard';
import AdvancedBackground from '../components/AdvancedBackground';

// Status indicator component
const StatusIndicator = ({ status }) => {
  let color = '#66bb6a'; // Green for good
  let icon = <CheckCircleIcon fontSize="small" />;
  let label = 'Good';
  
  if (status === 'warning') {
    color = '#ff9800'; // Orange for warning
    icon = <WarningIcon fontSize="small" />;
    label = 'Needs Attention';
  } else if (status === 'critical') {
    color = '#f44336'; // Red for critical
    icon = <ErrorIcon fontSize="small" />;
    label = 'Critical';
  } else if (status === 'maintenance') {
    color = '#2196f3'; // Blue for maintenance
    icon = <BuildIcon fontSize="small" />;
    label = 'In Maintenance';
  }
  
  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      sx={{
        bgcolor: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.2)`,
        color: color,
        borderRadius: '4px',
      }}
    />
  );
};

// Health indicator component
const HealthIndicator = ({ health }) => {
  let color = '#66bb6a'; // Green for good health
  
  if (health < 30) {
    color = '#f44336'; // Red for poor health
  } else if (health < 70) {
    color = '#ff9800'; // Orange for medium health
  }
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <LinearProgress 
        variant="determinate" 
        value={health} 
        sx={{ 
          width: 60, 
          height: 8, 
          mr: 1,
          borderRadius: 1,
          bgcolor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': {
            bgcolor: color
          }
        }} 
      />
      <Typography variant="caption" sx={{ color }}>
        {health}%
      </Typography>
    </Box>
  );
};

// Asset card component
const AssetCard = ({ asset }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <Paper sx={{ 
      p: 2, 
      bgcolor: 'rgba(0,0,0,0.4)', 
      borderRadius: 2,
      height: '100%'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle1" fontWeight="medium">
          {asset.name}
        </Typography>
        <IconButton size="small" onClick={handleMenuClick}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          sx={{ transition: 'none' }}
        >
          <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
          <MenuItem onClick={handleMenuClose}>Schedule Maintenance</MenuItem>
          <MenuItem onClick={handleMenuClose}>View History</MenuItem>
          <MenuItem onClick={handleMenuClose}>Generate Report</MenuItem>
        </Menu>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 2 }}>
        <LocationIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', mr: 0.5 }} />
        <Typography variant="caption" color="text.secondary">
          {asset.location}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
      
      <Box sx={{ mb: 2 }}>
        <StatusIndicator status={asset.status} />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Health:
        </Typography>
        <HealthIndicator health={asset.health} />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Last Serviced:
        </Typography>
        <Typography variant="body2">
          {asset.lastService}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Next Service:
        </Typography>
        <Typography variant="body2">
          {asset.nextService}
        </Typography>
      </Box>
    </Paper>
  );
};

const Facility = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Sample asset data
  const assets = [
    {
      id: 1,
      name: 'HVAC Unit 101',
      location: 'Building A, Floor 3',
      status: 'good',
      health: 85,
      lastService: 'Jan 15, 2023',
      nextService: 'Jul 15, 2023',
      type: 'HVAC'
    },
    {
      id: 2,
      name: 'Chiller System',
      location: 'Building B, Basement',
      status: 'warning',
      health: 62,
      lastService: 'Mar 10, 2023',
      nextService: 'Jun 10, 2023',
      type: 'HVAC'
    },
    {
      id: 3,
      name: 'Main Electrical Panel',
      location: 'Building A, Utility Room',
      status: 'critical',
      health: 28,
      lastService: 'Feb 5, 2023',
      nextService: 'May 5, 2023',
      type: 'Electrical'
    },
    {
      id: 4,
      name: 'Backup Generator',
      location: 'Building C, Exterior',
      status: 'maintenance',
      health: 75,
      lastService: 'Apr 20, 2023',
      nextService: 'Oct 20, 2023',
      type: 'Electrical'
    },
    {
      id: 5,
      name: 'Boiler System',
      location: 'Building B, Basement',
      status: 'good',
      health: 90,
      lastService: 'May 12, 2023',
      nextService: 'Nov 12, 2023',
      type: 'Plumbing'
    },
    {
      id: 6,
      name: 'Elevator 2',
      location: 'Building A, Core',
      status: 'warning',
      health: 58,
      lastService: 'Feb 28, 2023',
      nextService: 'May 28, 2023',
      type: 'Mechanical'
    },
    {
      id: 7,
      name: 'Fire Suppression System',
      location: 'Building C, All Floors',
      status: 'good',
      health: 95,
      lastService: 'Apr 5, 2023',
      nextService: 'Oct 5, 2023',
      type: 'Safety'
    },
    {
      id: 8,
      name: 'Water Treatment System',
      location: 'Building B, Basement',
      status: 'good',
      health: 88,
      lastService: 'Mar 15, 2023',
      nextService: 'Sep 15, 2023',
      type: 'Plumbing'
    }
  ];
  
  // Building overview data
  const buildingData = [
    { name: 'Building A', size: '120,000 sq ft', floors: 5, occupancy: '85%', yearBuilt: 2010 },
    { name: 'Building B', size: '85,000 sq ft', floors: 3, occupancy: '92%', yearBuilt: 2015 },
    { name: 'Building C', size: '150,000 sq ft', floors: 8, occupancy: '78%', yearBuilt: 2005 }
  ];

  const renderAssetGrid = () => (
    <Grid container spacing={3}>
      {assets.map(asset => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={asset.id}>
          <AssetCard asset={asset} />
        </Grid>
      ))}
    </Grid>
  );
  
  const renderAssetTable = () => (
    <TableContainer component={Paper} sx={{ bgcolor: 'rgba(0,0,0,0.4)' }}>
      <Table sx={{ transition: 'none' }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Health</TableCell>
            <TableCell>Next Service</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map(asset => (
            <TableRow key={asset.id} sx={{ transition: 'none' }}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.location}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell><StatusIndicator status={asset.status} /></TableCell>
              <TableCell><HealthIndicator health={asset.health} /></TableCell>
              <TableCell>{asset.nextService}</TableCell>
              <TableCell>
                <IconButton size="small" sx={{ transition: 'none' }}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  const renderBuildingOverview = () => (
    <Box>
      <Grid container spacing={3}>
        {buildingData.map((building, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper sx={{ 
              p: 3, 
              bgcolor: 'rgba(0,0,0,0.4)', 
              borderRadius: 2,
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: '#00ff88' }} />
                <Typography variant="h6">{building.name}</Typography>
              </Box>
              
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
              
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Size:</Typography>
                  <Typography variant="body2">{building.size}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Floors:</Typography>
                  <Typography variant="body2">{building.floors}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Occupancy:</Typography>
                  <Typography variant="body2">{building.occupancy}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Year Built:</Typography>
                  <Typography variant="body2">{building.yearBuilt}</Typography>
                </Box>
              </Stack>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    '&:hover': {
                      borderColor: '#00ff88',
                      backgroundColor: 'rgba(0,255,136,0.1)'
                    }
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <GlassCard sx={{ mt: 4 }}>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Facility Overview
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>
                  Space Utilization
                </Typography>
                <Typography variant="body2">
                  Total Space: 355,000 sq ft<br />
                  Occupied: 298,200 sq ft (84%)<br />
                  Available: 56,800 sq ft (16%)
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>
                  Asset Distribution
                </Typography>
                <Typography variant="body2">
                  Total Assets: 487<br />
                  Critical Assets: 127<br />
                  Assets Requiring Maintenance: 35
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>
                  Facility Health Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={78} 
                    sx={{ 
                      flexGrow: 1,
                      height: 10, 
                      mr: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#00ff88'
                      }
                    }} 
                  />
                  <Typography variant="body2" fontWeight="bold" color="#00ff88">
                    78%
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>
                  Energy Efficiency
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={65} 
                    sx={{ 
                      flexGrow: 1,
                      height: 10, 
                      mr: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#00b4d8'
                      }
                    }} 
                  />
                  <Typography variant="body2" fontWeight="bold" color="#00b4d8">
                    65%
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </GlassCard>
    </Box>
  );
  
  return (
    <Box sx={{ py: 3 }}>
      <AdvancedBackground />
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
            Facility Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor your facilities and equipment
          </Typography>
        </Box>
        
        <Box>
          <TextField
            size="small"
            placeholder="Search assets..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mr: 1, 
              bgcolor: 'rgba(0,0,0,0.4)',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
              },
            }}
          />
          
          <Button 
            variant="outlined" 
            startIcon={<FilterIcon />}
            sx={{ 
              borderColor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              '&:hover': {
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0,255,136,0.1)'
              }
            }}
          >
            Filter
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ 
            '& .MuiTabs-indicator': {
              backgroundColor: '#00ff88',
            }
          }}
        >
          <Tab 
            label="Assets" 
            sx={{ 
              color: tabValue === 0 ? '#00ff88' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#00ff88',
              }
            }} 
          />
          <Tab 
            label="Asset Table" 
            sx={{ 
              color: tabValue === 1 ? '#00ff88' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#00ff88',
              }
            }} 
          />
          <Tab 
            label="Buildings" 
            sx={{ 
              color: tabValue === 2 ? '#00ff88' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#00ff88',
              }
            }} 
          />
        </Tabs>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        {tabValue === 0 && renderAssetGrid()}
        {tabValue === 1 && renderAssetTable()}
        {tabValue === 2 && renderBuildingOverview()}
      </Box>
      
      <GlassCard>
        <Box p={3}>
          <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom>
            Facility Statistics
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#00ff88' }}>
                  487
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Assets
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#00b4d8' }}>
                  92%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Asset Availability
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#f57c00' }}>
                  35
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maintenance Required
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#d32f2f' }}>
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Critical Issues
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </GlassCard>
    </Box>
  );
};

export default Facility; 