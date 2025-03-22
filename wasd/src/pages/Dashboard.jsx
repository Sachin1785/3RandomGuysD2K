import React from 'react';
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
  IconButton
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  BuildRounded,
  ScheduleRounded,
  WarningRounded,
  CheckCircleRounded,
  PendingRounded,
  BarChartRounded,
  MoreVertRounded
} from '@mui/icons-material';
import GlassCard from '../components/GlassCard';
import AdvancedBackground from '../components/AdvancedBackground';

const StatCard = ({ title, value, icon, color, bgColor }) => (
  <Card sx={{ 
    height: '100%', 
    bgcolor: 'rgba(0,0,0,0.4)', 
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: '12px', 
          bgcolor: bgColor || 'rgba(0, 255, 136, 0.1)',
          color: color || 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const TaskStatusCard = ({ title, tasks }) => (
  <Card sx={{ 
    height: '100%', 
    bgcolor: 'rgba(0,0,0,0.4)', 
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)'
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small">
          <MoreVertRounded fontSize="small" />
        </IconButton>
      </Box>
      <Stack spacing={2}>
        {tasks.map((task, index) => (
          <Box key={index} sx={{ 
            p: 1.5, 
            borderRadius: '8px', 
            bgcolor: 'rgba(255,255,255,0.05)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
          }}>
            <Typography variant="body2" fontWeight="medium">
              {task.name}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {task.equipment} • Due {task.due}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                px: 1, 
                py: 0.5, 
                borderRadius: '4px',
                fontSize: '0.7rem',
                bgcolor: task.priorityColor,
                color: '#fff'
              }}>
                {task.priority}
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // Sample tasks for the upcoming tasks list
  const upcomingTasks = [
    { 
      name: 'HVAC Filter Replacement', 
      equipment: 'AHU-101', 
      due: 'Today', 
      priority: 'High',
      priorityColor: 'rgba(245, 124, 0, 0.8)'
    },
    { 
      name: 'Pressure Valve Inspection', 
      equipment: 'Boiler-3', 
      due: 'Tomorrow', 
      priority: 'Medium',
      priorityColor: 'rgba(255, 179, 0, 0.8)'
    },
    { 
      name: 'Electrical Panel Testing', 
      equipment: 'Panel-B', 
      due: 'in 2 days', 
      priority: 'Low',
      priorityColor: 'rgba(102, 187, 106, 0.8)'
    },
  ];

  // Sample tasks for the critical issues list
  const criticalIssues = [
    { 
      name: 'Compressor Failure', 
      equipment: 'Chiller-2', 
      due: 'Now', 
      priority: 'Critical',
      priorityColor: 'rgba(255, 23, 68, 0.8)'
    },
    { 
      name: 'Oil Leak', 
      equipment: 'Hydraulic Press', 
      due: 'Today', 
      priority: 'High',
      priorityColor: 'rgba(245, 124, 0, 0.8)'
    },
  ];

  return (
    <Box sx={{ py: 2 }}>
      <AdvancedBackground />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
          CMMS Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your Computerized Maintenance Management System
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          System Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Equipment" 
              value="387" 
              icon={<BuildRounded />} 
              color="#00ff88"
              bgColor="rgba(0, 255, 136, 0.1)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Scheduled Tasks" 
              value="42" 
              icon={<ScheduleRounded />} 
              color="#00b4d8"
              bgColor="rgba(0, 180, 216, 0.1)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Critical Issues" 
              value="7" 
              icon={<WarningRounded />} 
              color="#f57c00"
              bgColor="rgba(245, 124, 0, 0.1)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Completed Today" 
              value="15" 
              icon={<CheckCircleRounded />} 
              color="#66bb6a"
              bgColor="rgba(102, 187, 106, 0.1)"
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <GlassCard>
            <Box p={3}>
              <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom>
                About This CMMS System
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                Welcome to the Matrix CMMS – a modern Computerized Maintenance Management System designed to streamline maintenance operations with an intuitive interface and powerful features.
              </Typography>
              <Typography variant="body1" paragraph>
                Our CMMS helps maintenance teams efficiently track equipment, schedule preventive maintenance, manage work orders, and analyze performance through comprehensive reporting.
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Key Features:</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold" gutterBottom>
                      Asset Management
                    </Typography>
                    <Typography variant="body2">
                      Track equipment details, maintenance history, and documentation in one central location.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold" gutterBottom>
                      Preventive Maintenance
                    </Typography>
                    <Typography variant="body2">
                      Schedule recurring maintenance tasks based on time intervals or equipment usage.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold" gutterBottom>
                      Work Order Management
                    </Typography>
                    <Typography variant="body2">
                      Create, assign, prioritize, and track maintenance work orders through completion.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold" gutterBottom>
                      Reporting & Analytics
                    </Typography>
                    <Typography variant="body2">
                      Gain insights through customizable reports, dashboards, and performance metrics.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" sx={{ mr: 1 }}>
                  Learn More
                </Button>
                <Button variant="contained">
                  Get Started
                </Button>
              </Box>
            </Box>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <TaskStatusCard title="Upcoming Tasks" tasks={upcomingTasks} />
            <TaskStatusCard title="Critical Issues" tasks={criticalIssues} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 