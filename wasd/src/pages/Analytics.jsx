import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Close as CloseIcon,
  Info as InfoIcon,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import GlassCard from '../components/GlassCard';
import AdvancedBackground from '../components/AdvancedBackground';
import DynamicChart from '../components/DynamicChart';

// Sample data for analytics charts
const ANALYTICS_DATA = {
  taskCompletionData: {
    label: "Task Completion Rates",
    data: [
      { month: 'Jan', completed: 85, pending: 15, missed: 5 },
      { month: 'Feb', completed: 75, pending: 20, missed: 8 },
      { month: 'Mar', completed: 90, pending: 10, missed: 3 },
      { month: 'Apr', completed: 70, pending: 25, missed: 12 },
      { month: 'May', completed: 80, pending: 18, missed: 7 },
      { month: 'Jun', completed: 88, pending: 12, missed: 4 },
      { month: 'Jul', completed: 79, pending: 16, missed: 11 },
      { month: 'Aug', completed: 83, pending: 14, missed: 6 },
      { month: 'Sep', completed: 86, pending: 12, missed: 5 },
      { month: 'Oct', completed: 91, pending: 8, missed: 2 },
      { month: 'Nov', completed: 84, pending: 14, missed: 6 },
      { month: 'Dec', completed: 78, pending: 18, missed: 9 }
    ],
    labelKey: 'month',
    dataKeys: ['completed', 'pending', 'missed'],
    dataLabels: ['Completed', 'Pending', 'Missed']
  },
  taskMissData: {
    label: "Task Miss by Day of Week",
    data: {
      'Monday': 32,
      'Tuesday': 19,
      'Wednesday': 14,
      'Thursday': 22,
      'Friday': 43,
      'Saturday': 12,
      'Sunday': 5
    }
  },
  workloadDistributionData: {
    label: "Workload by Team",
    data: [
      { team: 'Team A', maintenance: 120, repair: 85, inspection: 45 },
      { team: 'Team B', maintenance: 85, repair: 60, inspection: 30 },
      { team: 'Team C', maintenance: 60, repair: 45, inspection: 25 },
      { team: 'Team D', maintenance: 95, repair: 70, inspection: 35 },
      { team: 'Team E', maintenance: 75, repair: 55, inspection: 28 }
    ],
    labelKey: 'team',
    dataKeys: ['maintenance', 'repair', 'inspection'],
    dataLabels: ['Maintenance', 'Repair', 'Inspection']
  },
  resourceUtilizationData: {
    label: "Resource Utilization",
    data: [
      { category: 'Human Resources', value: 85 },
      { category: 'Equipment', value: 72 },
      { category: 'Vehicles', value: 68 },
      { category: 'Tools', value: 91 },
      { category: 'Facilities', value: 78 },
      { category: 'Budget', value: 65 }
    ],
    labelKey: 'category',
    dataKeys: ['value'],
    dataLabels: ['Utilization %']
  }
};

// SHAP Analysis Dialog
const ShapAnalysisDialog = ({ open, onClose, title, chartType }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Content based on chart type
  const getContent = () => {
    switch(chartType) {
      case 'task-completion':
        return (
          <>
            <Typography variant="body1" paragraph>
              The task completion analysis shows several key factors affecting completion rates:
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
              <Typography variant="subtitle1" color="primary.main" fontWeight="bold" gutterBottom>
                Key Factors Influencing Task Completion:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#00ff88', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Resource Availability (38%)</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#00b4d8', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Task Complexity (27%)</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#f57c00', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Time of Day (19%)</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#d32f2f', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Day of Week (16%)</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Typography variant="body1" paragraph>
              SHAP analysis reveals that resource availability is the most significant factor impacting task completion rates, followed by task complexity. Tasks scheduled during peak hours (10am-2pm) have higher completion rates.
            </Typography>
            <Paper sx={{ bgcolor: 'rgba(0,255,136,0.1)', p: 2, borderRadius: 2, mt: 2 }}>
              <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                Recommendation:
              </Typography>
              <Typography variant="body2">
                Redistribute complex tasks to periods with higher resource availability and avoid scheduling critical tasks during resource-constrained periods (Fridays and Mondays).
              </Typography>
            </Paper>
          </>
        );
      case 'task-miss-heatmap':
        return (
          <>
            <Typography variant="body1" paragraph>
              The heatmap analysis identifies time periods with highest risk of missed tasks:
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
              <Typography variant="subtitle1" color="primary.main" fontWeight="bold" gutterBottom>
                High-Risk Time Periods:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#d32f2f', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Friday Afternoons (2pm-5pm): 43% higher miss rate</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#f57c00', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Monday Mornings (8am-10am): 32% higher miss rate</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#ffeb3b', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">End of Month (Days 28-31): 27% higher miss rate</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Typography variant="body1" paragraph>
              SHAP values indicate that task misses correlate strongly with resource constraints, complexity, and timing factors. The highest risk occurs when complex tasks are scheduled during periods with staff shortages.
            </Typography>
            <Paper sx={{ bgcolor: 'rgba(0,255,136,0.1)', p: 2, borderRadius: 2, mt: 2 }}>
              <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                Recommendation:
              </Typography>
              <Typography variant="body2">
                Implement a dynamic scheduling system that redistributes high-priority tasks away from high-risk time slots and ensures critical tasks have adequate resource allocation during peak miss periods.
              </Typography>
            </Paper>
          </>
        );
      case 'workload-distribution':
        return (
          <>
            <Typography variant="body1" paragraph>
              The workload distribution analysis highlights imbalances across teams and time periods:
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
              <Typography variant="subtitle1" color="primary.main" fontWeight="bold" gutterBottom>
                Workload Distribution Factors:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#00ff88', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Team Size (35% impact on workload balance)</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#00b4d8', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Task Specialization (29% impact)</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#f57c00', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Seasonal Workload Variations (21% impact)</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Typography variant="body1" paragraph>
              SHAP analysis reveals that Maintenance Team A is consistently overloaded (137% of optimal capacity) while Team C is underutilized (68% of capacity). Task specialization is creating bottlenecks for HVAC maintenance tasks.
            </Typography>
            <Paper sx={{ bgcolor: 'rgba(0,255,136,0.1)', p: 2, borderRadius: 2, mt: 2 }}>
              <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                Recommendation:
              </Typography>
              <Typography variant="body2">
                Implement cross-training program to distribute specialized tasks more evenly and adjust team allocations to balance workload. Consider temporary resource reallocation during seasonal peaks.
              </Typography>
            </Paper>
          </>
        );
      case 'resource-utilization':
        return (
          <>
            <Typography variant="body1" paragraph>
              The resource utilization analysis provides insights into how efficiently resources are being used:
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
              <Typography variant="subtitle1" color="primary.main" fontWeight="bold" gutterBottom>
                Resource Efficiency Factors:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#00ff88', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Task Grouping Efficiency (41% impact)</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#00b4d8', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Travel Time Between Tasks (25% impact)</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#f57c00', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Skill Matching (19% impact)</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Typography variant="body1" paragraph>
              SHAP analysis shows that resources are most efficiently utilized when similar tasks are grouped by location. Travel time between tasks accounts for 23% of wasted capacity. Teams with diverse skill sets show 31% higher utilization rates.
            </Typography>
            <Paper sx={{ bgcolor: 'rgba(0,255,136,0.1)', p: 2, borderRadius: 2, mt: 2 }}>
              <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                Recommendation:
              </Typography>
              <Typography variant="body2">
                Implement location-based task batching and optimize routes to minimize travel time. Create balanced teams with complementary skill sets to improve overall resource utilization.
              </Typography>
            </Paper>
          </>
        );
      default:
        return <Typography>Select a chart to see SHAP analysis</Typography>;
    }
  };

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
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white', 
        pb: 1, 
        pt: 2,
      }}>
        <Typography variant="h5" component="span" sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #00ff88, #00b4d8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {title} - SHAP Analysis
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <DialogContent sx={{ color: 'white', py: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} 
            sx={{ 
              '& .MuiTabs-indicator': {
                backgroundColor: '#00ff88',
              }
            }}
          >
            <Tab label="Feature Impact" sx={{ 
              color: activeTab === 0 ? '#00ff88' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#00ff88',
              }
            }} />
            <Tab label="Time Analysis" sx={{ 
              color: activeTab === 1 ? '#00ff88' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#00ff88',
              }
            }} />
            <Tab label="Recommendations" sx={{ 
              color: activeTab === 2 ? '#00ff88' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#00ff88',
              }
            }} />
          </Tabs>
        </Box>
        
        {getContent()}
        
      </DialogContent>
    </Dialog>
  );
};

const Analytics = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [chartType, setChartType] = useState('');
  
  const handleChartClick = (title, type) => {
    setDialogTitle(title);
    setChartType(type);
    setDialogOpen(true);
  };

  // Chart click wrapper for DynamicChart
  const ChartWrapper = ({ children, title, type }) => (
    <Box 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:active': {
          transform: 'scale(0.99)',
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleChartClick(title, type);
      }}
    >
      {children}
    </Box>
  );
  
  return (
    <Box sx={{ py: 3 }}>
      <AdvancedBackground />
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Insights and predictive analytics for facility management
          </Typography>
        </Box>
        
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
          Filter Data
        </Button>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Performance Metrics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ChartWrapper title="Task Completion" type="task-completion">
              <DynamicChart
                type="line"
                data={ANALYTICS_DATA.taskCompletionData.data}
                labelKey={ANALYTICS_DATA.taskCompletionData.labelKey}
                dataKeys={ANALYTICS_DATA.taskCompletionData.dataKeys}
                dataLabels={ANALYTICS_DATA.taskCompletionData.dataLabels}
                title={ANALYTICS_DATA.taskCompletionData.label}
                height={300}
                fill={true}
                tension={0.4}
              />
            </ChartWrapper>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartWrapper title="Task Miss Heatmap" type="task-miss-heatmap">
              <DynamicChart
                type="bar"
                data={ANALYTICS_DATA.taskMissData.data}
                title={ANALYTICS_DATA.taskMissData.label}
                height={300}
                customOptions={{
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </ChartWrapper>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Resource Analysis
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ChartWrapper title="Workload Distribution" type="workload-distribution">
              <DynamicChart
                type="bar"
                data={ANALYTICS_DATA.workloadDistributionData.data}
                labelKey={ANALYTICS_DATA.workloadDistributionData.labelKey}
                dataKeys={ANALYTICS_DATA.workloadDistributionData.dataKeys}
                dataLabels={ANALYTICS_DATA.workloadDistributionData.dataLabels}
                title={ANALYTICS_DATA.workloadDistributionData.label}
                height={300}
                stacked={true}
              />
            </ChartWrapper>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartWrapper title="Resource Utilization" type="resource-utilization">
              <DynamicChart
                type="radar"
                data={ANALYTICS_DATA.resourceUtilizationData.data}
                labelKey={ANALYTICS_DATA.resourceUtilizationData.labelKey}
                dataKeys={ANALYTICS_DATA.resourceUtilizationData.dataKeys}
                dataLabels={ANALYTICS_DATA.resourceUtilizationData.dataLabels}
                title={ANALYTICS_DATA.resourceUtilizationData.label}
                height={300}
              />
            </ChartWrapper>
          </Grid>
        </Grid>
      </Box>
      
      <GlassCard>
        <Box p={3}>
          <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom>
            Predictive Insights
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            Based on current trends and machine learning predictions, the following insights have been identified:
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: '#d32f2f',
                    mr: 1 
                  }} />
                  <Typography variant="subtitle1" fontWeight="medium">
                    High Risk
                  </Typography>
                </Box>
                <Typography variant="body2">
                  HVAC maintenance tasks are predicted to have a 42% higher risk of delay next week due to resource constraints.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: '#f57c00',
                    mr: 1 
                  }} />
                  <Typography variant="subtitle1" fontWeight="medium">
                    Resource Optimization
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Redistributing electrical maintenance tasks could improve overall completion rate by 23%.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: '#00ff88',
                    mr: 1 
                  }} />
                  <Typography variant="subtitle1" fontWeight="medium">
                    Trending Improvement
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Plumbing maintenance efficiency has increased by 18% following recent schedule adjustments.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </GlassCard>
      
      <ShapAnalysisDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title={dialogTitle}
        chartType={chartType}
      />
    </Box>
  );
};

export default Analytics; 