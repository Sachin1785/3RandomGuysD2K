import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tab, 
  Tabs, 
  Paper,
  Button,
  IconButton
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  CalendarMonth as CalendarIcon,
  Add as AddIcon
} from '@mui/icons-material';
import TaskList from '../components/TaskList';
import TaskCalendar from '../components/TaskCalendar';
import AdvancedBackground from '../components/AdvancedBackground';

// Mock tasks for demonstration - this would typically come from an API
// The TaskList component has its own data, but we pass this to the calendar
import { mockTasks } from '../components/TaskList';

const TaskOverview = () => {
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  
  return (
    <Box sx={{ py: 2 }}>
      <AdvancedBackground />
      
      {/* Page Header */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center' 
      }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Task Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and visualize your maintenance tasks
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ 
              bgcolor: 'rgba(0, 255, 136, 0.1)', 
              color: '#00ff88',
              fontWeight: 'medium'
            }}
          >
            New Task
          </Button>
          
          <Paper sx={{ 
            display: 'flex', 
            bgcolor: 'rgba(0,0,0,0.3)', 
            p: 0.5,
            borderRadius: 1
          }}>
            <IconButton 
              color={view === 'list' ? 'primary' : 'default'}
              onClick={() => setView('list')}
              size="small"
            >
              <ViewListIcon />
            </IconButton>
            <IconButton 
              color={view === 'calendar' ? 'primary' : 'default'}
              onClick={() => setView('calendar')}
              size="small"
            >
              <CalendarIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>
      
      {/* View Content */}
      <Box>
        {view === 'list' ? (
          <TaskList />
        ) : (
          <TaskCalendar tasks={mockTasks} />
        )}
      </Box>
    </Box>
  );
};

export default TaskOverview; 