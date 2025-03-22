import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Grid, 
  Chip,
  Tooltip,
  Divider,
  Button,
  Badge,
  Stack
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  ViewDay as ViewDayIcon,
  ViewWeek as ViewWeekIcon,
  ViewModule as ViewMonthIcon,
  FlagRounded as FlagIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { format, addDays, startOfWeek, endOfWeek, addMonths, startOfMonth, 
  endOfMonth, isSameMonth, isSameDay, addWeeks, subDays, subMonths, subWeeks,
  getDay, isWithinInterval, parseISO } from 'date-fns';
import GlassCard from './GlassCard';

// Views
const VIEWS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
};

// Priority colors
const priorityColors = {
  critical: '#ff1744',
  high: '#f57c00',
  medium: '#ffb300',
  low: '#66bb6a',
};

const TaskCalendar = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(VIEWS.MONTH);
  const [calendarDays, setCalendarDays] = useState([]);
  
  // Create calendar days based on current view and date
  useEffect(() => {
    const days = [];
    
    if (view === VIEWS.DAY) {
      days.push(currentDate);
    } 
    else if (view === VIEWS.WEEK) {
      let startDay = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
      for (let i = 0; i < 7; i++) {
        days.push(addDays(startDay, i));
      }
    } 
    else if (view === VIEWS.MONTH) {
      // Fill first week with days from previous month if needed
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
      
      let day = startDate;
      while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
      }
    }
    
    setCalendarDays(days);
  }, [currentDate, view]);
  
  // Navigate to previous period
  const goToPrevious = () => {
    if (view === VIEWS.DAY) {
      setCurrentDate(subDays(currentDate, 1));
    } else if (view === VIEWS.WEEK) {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === VIEWS.MONTH) {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };
  
  // Navigate to next period
  const goToNext = () => {
    if (view === VIEWS.DAY) {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === VIEWS.WEEK) {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === VIEWS.MONTH) {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };
  
  // Reset to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Get the header title based on current view
  const getHeaderText = () => {
    if (view === VIEWS.DAY) {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    } else if (view === VIEWS.WEEK) {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      const formattedStart = format(weekStart, 'MMM d');
      const formattedEnd = format(weekEnd, 'MMM d, yyyy');
      return `${formattedStart} - ${formattedEnd}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };
  
  // Filter tasks for a specific day
  const getTasksForDay = (day) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return tasks.filter(task => {
      const taskDate = parseISO(task.created_at);
      return isSameDay(taskDate, day);
    });
  };
  
  // Generate calendar grid based on view
  const renderCalendarGrid = () => {
    if (view === VIEWS.DAY) {
      return renderDayView();
    } else if (view === VIEWS.WEEK) {
      return renderWeekView();
    } else {
      return renderMonthView();
    }
  };
  
  // Render day view
  const renderDayView = () => {
    const dayTasks = getTasksForDay(currentDate);
    
    return (
      <Box sx={{ minHeight: 400, p: 2, transition: 'none' }}>
        <Typography variant="h6" sx={{ mb: 2, transition: 'none' }}>
          {format(currentDate, 'EEEE, MMMM d')}
        </Typography>
        
        <Divider sx={{ mb: 2, transition: 'none' }} />
        
        {dayTasks.length > 0 ? (
          <Stack spacing={1} sx={{ transition: 'none' }}>
            {dayTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </Stack>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 150, 
            color: 'text.secondary',
            transition: 'none'
          }}>
            <Typography sx={{ transition: 'none' }}>No tasks scheduled for this day</Typography>
          </Box>
        )}
      </Box>
    );
  };
  
  // Render week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    
    return (
      <Grid container spacing={1} sx={{ minHeight: 400, transition: 'none' }}>
        {days.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          
          return (
            <Grid item key={index} xs={12/7}>
              <Paper sx={{ 
                p: 1, 
                minHeight: 400, 
                bgcolor: 'rgba(0,0,0,0.3)', 
                border: isSameDay(day, new Date()) ? '1px solid #00ff88' : '1px solid rgba(255,255,255,0.1)',
                transition: 'none'
              }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    textAlign: 'center', 
                    fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal',
                    color: isSameDay(day, new Date()) ? '#00ff88' : 'inherit',
                    transition: 'none'
                  }}
                >
                  {format(day, 'EEE')}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 1,
                    fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal',
                    color: isSameDay(day, new Date()) ? '#00ff88' : 'inherit',
                    transition: 'none'
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                
                <Divider sx={{ mb: 1, transition: 'none' }} />
                
                <Stack spacing={0.5} sx={{ maxHeight: 330, overflow: 'auto', transition: 'none' }}>
                  {dayTasks.map(task => (
                    <TaskItem key={task.id} task={task} compact />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };
  
  // Render month view
  const renderMonthView = () => {
    // Create header with weekday names
    const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
      <Box sx={{ minHeight: 450 }}>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {weekdayNames.map((day, index) => (
            <Grid item key={index} xs={12/7}>
              <Typography 
                variant="subtitle2" 
                sx={{ textAlign: 'center', fontWeight: 'medium', color: 'text.secondary' }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={1}>
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <Grid item key={index} xs={12/7}>
                <Paper sx={{ 
                  p: 1, 
                  height: 90, 
                  bgcolor: 'rgba(0,0,0,0.3)', 
                  opacity: isCurrentMonth ? 1 : 0.5,
                  border: isToday ? '1px solid #00ff88' : '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden'
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: isToday ? 'bold' : 'normal',
                      color: isToday ? '#00ff88' : 'inherit'
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>
                  
                  <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                    {dayTasks.slice(0, 2).map(task => (
                      <Tooltip key={task.id} title={task.task_name}>
                        <Chip
                          size="small"
                          label={task.task_name.length > 12 ? `${task.task_name.substring(0, 12)}...` : task.task_name}
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: `${priorityColors[task.priority]}22`,
                            color: priorityColors[task.priority],
                            borderColor: priorityColors[task.priority],
                            '& .MuiChip-label': { px: 1 },
                            transition: 'none'
                          }}
                          variant="outlined"
                        />
                      </Tooltip>
                    ))}
                    
                    {dayTasks.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{dayTasks.length - 2} more tasks
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };
  
  // Task item component
  const TaskItem = ({ task, compact = false }) => {
    const priorityColor = priorityColors[task.priority] || '#757575';
    
    if (compact) {
      return (
        <Tooltip title={`${task.task_name} - ${task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}>
          <Chip
            size="small"
            icon={<FlagIcon style={{ color: priorityColor, fontSize: '0.7rem' }} />}
            label={task.task_name.length > 15 ? `${task.task_name.substring(0, 15)}...` : task.task_name}
            sx={{
              fontSize: '0.7rem',
              bgcolor: `${priorityColor}22`,
              color: priorityColor,
              borderColor: priorityColor,
              fontWeight: 'bold',
              '& .MuiChip-label': { px: 1 },
              transition: 'none'
            }}
            variant="outlined"
          />
        </Tooltip>
      );
    }
    
    return (
      <Paper sx={{ 
        p: 1.5, 
        bgcolor: `${priorityColor}11`, 
        borderLeft: `3px solid ${priorityColor}`,
        transition: 'none'
      }}>
        <Typography variant="subtitle2" fontWeight="medium">
          {task.task_name}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Chip
            size="small"
            label={task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            sx={{ fontSize: '0.7rem', height: 20 }}
            color={
              task.status === 'completed' ? 'success' : 
              task.status === 'in_progress' ? 'warning' : 'info'
            }
          />
          
          <Chip
            size="small"
            icon={<FlagIcon style={{ color: priorityColor, fontSize: '0.7rem' }} />}
            label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            sx={{
              fontSize: '0.7rem',
              bgcolor: `${priorityColor}22`,
              color: priorityColor,
              borderColor: priorityColor,
              fontWeight: 'bold',
              height: 20
            }}
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Time: {
              task.time_taken < 60 
                ? `${task.time_taken} min` 
                : `${Math.floor(task.time_taken / 60)} hr ${task.time_taken % 60} min`
            }
          </Typography>
          
          <Badge 
            badgeContent={task.prediction_score} 
            color={
              task.prediction_score > 70 ? 'error' : 
              task.prediction_score > 40 ? 'warning' : 'success'
            }
            sx={{ mr: 1 }}
          >
            <Typography variant="caption" color="text.secondary">Risk</Typography>
          </Badge>
        </Box>
      </Paper>
    );
  };
  
  return (
    <GlassCard sx={{ transition: 'none' }}>
      <Box sx={{ p: 2, transition: 'none' }}>
        {/* Calendar Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          transition: 'none'
        }}>
          <Typography variant="h5" component="h2">
            Task Calendar
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              variant="outlined"
              onClick={goToToday}
              startIcon={<TodayIcon />}
              sx={{ transition: 'none' }}
            >
              Today
            </Button>
            
            <IconButton onClick={goToPrevious} size="small" sx={{ transition: 'none' }}>
              <ChevronLeftIcon />
            </IconButton>
            
            <IconButton onClick={goToNext} size="small" sx={{ transition: 'none' }}>
              <ChevronRightIcon />
            </IconButton>
            
            <Typography variant="subtitle1" sx={{ 
              minWidth: 180, 
              display: 'flex', 
              alignItems: 'center', 
              mx: 1,
              fontWeight: 'medium'
            }}>
              {getHeaderText()}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              bgcolor: 'rgba(0,0,0,0.3)', 
              borderRadius: 1, 
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'none'
            }}>
              <Tooltip title="Day view">
                <IconButton 
                  size="small" 
                  onClick={() => setView(VIEWS.DAY)}
                  color={view === VIEWS.DAY ? 'primary' : 'default'}
                  sx={{ transition: 'none' }}
                >
                  <ViewDayIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Week view">
                <IconButton 
                  size="small" 
                  onClick={() => setView(VIEWS.WEEK)}
                  color={view === VIEWS.WEEK ? 'primary' : 'default'}
                  sx={{ transition: 'none' }}
                >
                  <ViewWeekIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Month view">
                <IconButton 
                  size="small" 
                  onClick={() => setView(VIEWS.MONTH)}
                  color={view === VIEWS.MONTH ? 'primary' : 'default'}
                  sx={{ transition: 'none' }}
                >
                  <ViewMonthIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        
        {/* Calendar Body */}
        {renderCalendarGrid()}
      </Box>
    </GlassCard>
  );
};

export default TaskCalendar; 