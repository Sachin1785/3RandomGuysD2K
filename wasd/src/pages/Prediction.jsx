import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  InfoOutlined as InfoIcon,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import GlassCard from '../components/GlassCard';
import AdvancedBackground from '../components/AdvancedBackground';


const RiskIndicator = ({ score, size = 'medium' }) => {
  let color = '#66bb6a'; 
  if (score > 70) color = '#f44336'; 
  else if (score > 40) color = '#ff9800'; 
  
  const sizeMap = {
    small: { width: 40, height: 40, fontSize: '0.8rem' },
    medium: { width: 60, height: 60, fontSize: '1rem' },
    large: { width: 80, height: 80, fontSize: '1.2rem' }
  };
  
  const { width, height, fontSize } = sizeMap[size];
  
  return (
    <Box 
      sx={{
        width,
        height,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0,0,0,0.6)',
        border: `3px solid ${color}`,
        color: 'white',
        boxShadow: `0 0 10px ${color}`,
        fontSize,
        fontWeight: 'bold'
      }}
    >
      {score}%
    </Box>
  );
};

// Task prediction card component
const TaskPredictionCard = ({ task, riskScore, prediction }) => {
  return (
    <Paper sx={{ 
      p: 2, 
      bgcolor: 'rgba(0,0,0,0.4)', 
      borderRadius: 2,
      border: riskScore > 70 ? '1px solid rgba(244, 67, 54, 0.5)' : '1px solid rgba(255,255,255,0.1)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {task}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <ScheduleIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              Due in 3 days
            </Typography>
          </Box>
        </Box>
        <RiskIndicator score={riskScore} size="small" />
      </Box>
      
      <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />
      
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Prediction:
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: prediction === 'At Risk' ? '#f44336' : 
                 prediction === 'Attention Needed' ? '#ff9800' : '#66bb6a'
          }}
        >
          {prediction}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 1.5 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Top Risk Factors:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {riskScore > 60 && (
            <Chip 
              label="Resource Constraints" 
              size="small" 
              sx={{ bgcolor: 'rgba(244, 67, 54, 0.2)', color: '#f44336', mb: 0.5 }} 
            />
          )}
          {riskScore > 40 && (
            <Chip 
              label="Historical Pattern" 
              size="small" 
              sx={{ bgcolor: 'rgba(255, 152, 0, 0.2)', color: '#ff9800', mb: 0.5 }} 
            />
          )}
          {riskScore > 30 && (
            <Chip 
              label="Task Complexity" 
              size="small" 
              sx={{ bgcolor: 'rgba(0, 180, 216, 0.2)', color: '#00b4d8', mb: 0.5 }} 
            />
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

const RiskFactor = ({ name, impact, trend }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight="medium">
          {name}
        </Typography>
      </Box>
      <Box sx={{ width: 100, textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: impact > 70 ? '#f44336' : 
                 impact > 40 ? '#ff9800' : '#66bb6a',
            fontWeight: 'medium'
          }}
        >
          {impact}% Impact
        </Typography>
      </Box>
      <Box sx={{ width: 40, textAlign: 'right' }}>
        {trend === 'up' ? (
          <TrendingUpIcon sx={{ color: '#f44336' }} />
        ) : (
          <TrendingDownIcon sx={{ color: '#66bb6a' }} />
        )}
      </Box>
    </Box>
  );
};

const Prediction = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  return (
    <Box sx={{ py: 3 }}>
      <AdvancedBackground />
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
            Task Prediction
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ML-powered predictions of task completion risks and insights
          </Typography>
        </Box>
        
        <Box>
          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <InputLabel id="timeframe-select-label">Timeframe</InputLabel>
            <Select
              labelId="timeframe-select-label"
              value={timeframe}
              label="Timeframe"
              onChange={(e) => setTimeframe(e.target.value)}
              sx={{ bgcolor: 'rgba(0,0,0,0.4)' }}
            >
              <MenuItem value="day">Next 24 Hours</MenuItem>
              <MenuItem value="week">Next 7 Days</MenuItem>
              <MenuItem value="month">Next 30 Days</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            sx={{ 
              borderColor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              '&:hover': {
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0,255,136,0.1)'
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <GlassCard>
            <Box p={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="medium">
                  Task Risk Predictions
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
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
                  Filter Tasks
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TaskPredictionCard 
                    task="HVAC System Maintenance" 
                    riskScore={82} 
                    prediction="At Risk" 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TaskPredictionCard 
                    task="Electrical Panel Inspection" 
                    riskScore={65} 
                    prediction="Attention Needed" 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TaskPredictionCard 
                    task="Plumbing System Check" 
                    riskScore={45} 
                    prediction="Attention Needed" 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TaskPredictionCard 
                    task="Safety Equipment Audit" 
                    riskScore={28} 
                    prediction="On Track" 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TaskPredictionCard 
                    task="Generator Maintenance" 
                    riskScore={72} 
                    prediction="At Risk" 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TaskPredictionCard 
                    task="Fire System Testing" 
                    riskScore={18} 
                    prediction="On Track" 
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    '&:hover': {
                      borderColor: '#00ff88',
                      backgroundColor: 'rgba(0,255,136,0.1)'
                    }
                  }}
                >
                  View All Tasks
                </Button>
              </Box>
            </Box>
          </GlassCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Overall Risk Score
                </Typography>
                <Tooltip title="Based on ML prediction model using historical task completion data and current resource availability">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <RiskIndicator score={64} size="large" />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Medium-High risk level detected for upcoming tasks
              </Typography>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Tasks at Risk:
                </Typography>
                <Typography variant="body2" fontWeight="medium" color="#f44336">
                  8 of 32 (25%)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Confidence Level:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  87%
                </Typography>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Key Risk Factors
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <RiskFactor name="Resource Availability" impact={78} trend="up" />
                <RiskFactor name="Task Complexity" impact={65} trend="up" />
                <RiskFactor name="Seasonal Workload" impact={52} trend="down" />
                <RiskFactor name="Equipment Status" impact={43} trend="up" />
                <RiskFactor name="Weather Conditions" impact={31} trend="down" />
              </Box>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              
              <Typography variant="body2" color="#00ff88">
                Resource constraints are the primary risk factor this week. Consider allocating additional staff to high-risk tasks.
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Model Accuracy
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Precision:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  89%
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Recall:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  92%
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  F1 Score:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  90%
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ROC-AUC:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  0.94
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              
              <Typography variant="body2" color="text.secondary">
                Last model update: Today, 4:32 PM
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Prediction; 