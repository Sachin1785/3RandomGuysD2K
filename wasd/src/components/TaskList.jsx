import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  Alert,
  TableSortLabel,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Popover,
  Stack,
  Divider,
  Badge,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  CalendarMonth as CalendarIcon,
  FlagRounded as FlagIcon,
  AccessTimeRounded as TimeIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';

// Mock data for task list
export const mockTasks = [
  {
    id: 1,
    task_name: "Inspect HVAC system",
    time_taken: 120, // minutes
    priority: "high",
    status: "completed",
    assigned_to: "John Doe",
    created_at: "2023-10-15T09:30:00Z",
    completed_at: "2023-10-15T11:30:00Z",
    prediction_score: 82
  },
  {
    id: 2,
    task_name: "Replace filters in AHU-3",
    time_taken: 45, // minutes
    priority: "medium",
    status: "completed",
    assigned_to: "Jane Smith",
    created_at: "2023-10-16T14:00:00Z",
    completed_at: "2023-10-16T14:45:00Z",
    prediction_score: 45
  },
  {
    id: 3,
    task_name: "Calibrate pressure sensors",
    time_taken: 90, // minutes
    priority: "high",
    status: "in_progress",
    assigned_to: "Mike Johnson",
    created_at: "2023-10-17T10:00:00Z",
    completed_at: null,
    prediction_score: 65
  },
  {
    id: 4,
    task_name: "Lubricate conveyor bearings",
    time_taken: 60, // minutes
    priority: "low",
    status: "completed",
    assigned_to: "Sarah Wilson",
    created_at: "2023-10-18T08:15:00Z",
    completed_at: "2023-10-18T09:15:00Z",
    prediction_score: 28
  },
  {
    id: 5,
    task_name: "Check electrical connections",
    time_taken: 30, // minutes
    priority: "medium",
    status: "pending",
    assigned_to: "Robert Brown",
    created_at: "2023-10-19T13:45:00Z",
    completed_at: null,
    prediction_score: 52
  },
  {
    id: 6,
    task_name: "Replace worn belts",
    time_taken: 75, // minutes
    priority: "high",
    status: "completed",
    assigned_to: "John Doe",
    created_at: "2023-10-20T09:00:00Z",
    completed_at: "2023-10-20T10:15:00Z",
    prediction_score: 40
  },
  {
    id: 7,
    task_name: "Test emergency shutdown",
    time_taken: 120, // minutes
    priority: "critical",
    status: "completed",
    assigned_to: "Jane Smith",
    created_at: "2023-10-21T11:30:00Z",
    completed_at: "2023-10-21T13:30:00Z",
    prediction_score: 75
  },
  {
    id: 8,
    task_name: "Inspect safety guards",
    time_taken: 45, // minutes
    priority: "high",
    status: "pending",
    assigned_to: "Mike Johnson",
    created_at: "2023-10-22T15:00:00Z",
    completed_at: null,
    prediction_score: 68
  },
  {
    id: 9,
    task_name: "Clean cooling towers",
    time_taken: 180, // minutes
    priority: "medium",
    status: "in_progress",
    assigned_to: "Sarah Wilson",
    created_at: "2023-10-23T08:00:00Z",
    completed_at: null,
    prediction_score: 58
  },
  {
    id: 10,
    task_name: "Calibrate flow meters",
    time_taken: 60, // minutes
    priority: "low",
    status: "completed",
    assigned_to: "Robert Brown",
    created_at: "2023-10-24T14:30:00Z",
    completed_at: "2023-10-24T15:30:00Z",
    prediction_score: 20
  },
  {
    id: 11,
    task_name: "Repair hydraulic leak",
    time_taken: 90, // minutes
    priority: "critical",
    status: "completed",
    assigned_to: "John Doe",
    created_at: "2023-10-25T10:15:00Z",
    completed_at: "2023-10-25T11:45:00Z",
    prediction_score: 88
  },
  {
    id: 12,
    task_name: "Check oil levels",
    time_taken: 30, // minutes
    priority: "medium",
    status: "pending",
    assigned_to: "Jane Smith",
    created_at: "2023-10-26T09:30:00Z",
    completed_at: null,
    prediction_score: 32
  }
];

const TaskList = ({ filterBy }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilters, setActiveFilters] = useState(0);

  // Date filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateAnchorEl, setDateAnchorEl] = useState(null);

  // Status chip colors
  const statusColors = {
    completed: 'success',
    in_progress: 'warning',
    pending: 'info',
  };

  // Priority colors
  const priorityColors = {
    critical: '#ff1744',
    high: '#f57c00',
    medium: '#ffb300',
    low: '#66bb6a',
  };

  // Status icons
  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'pending':
        return <PendingIcon fontSize="small" />;
      case 'in_progress':
        return <TimeIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Format time (convert minutes to hours and minutes)
  const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use mock data and filter it
      let filteredData = [...mockTasks];
      
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filteredData = filteredData.filter(task => 
          task.task_name.toLowerCase().includes(search)
        );
      }
      
      // Apply status filter
      if (filter && filter.type === 'status') {
        filteredData = filteredData.filter(task => 
          task.status === filter.value
        );
      }
      
      // Apply priority filter
      if (filter && filter.type === 'priority') {
        filteredData = filteredData.filter(task => 
          task.priority === filter.value
        );
      }
      
      // Apply risk level filter
      if (filter && filter.type === 'risk') {
        if (filter.value === 'high') {
          filteredData = filteredData.filter(task => task.prediction_score > 70);
        } else if (filter.value === 'medium') {
          filteredData = filteredData.filter(task => 
            task.prediction_score <= 70 && task.prediction_score > 40
          );
        } else if (filter.value === 'low') {
          filteredData = filteredData.filter(task => task.prediction_score <= 40);
        }
      }
      
      // Apply date filter
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        
        filteredData = filteredData.filter(task => {
          const taskDate = new Date(task.created_at);
          return taskDate >= start && taskDate <= end;
        });
      }
      
      // Sort data
      filteredData.sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        
        if (order === 'asc') {
          if (orderBy === 'time_taken' || orderBy === 'prediction_score') {
            return a[orderBy] - b[orderBy];
          }
          return aValue > bValue ? 1 : -1;
        } else {
          if (orderBy === 'time_taken' || orderBy === 'prediction_score') {
            return b[orderBy] - a[orderBy];
          }
          return aValue < bValue ? 1 : -1;
        }
      });
      
      // Paginate data
      const totalItems = filteredData.length;
      const paginatedData = filteredData.slice(
        page * rowsPerPage, 
        (page + 1) * rowsPerPage
      );
      
      setTasks(paginatedData);
      setTotalCount(totalItems);
      setError(null);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load task list. Please try again later.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page, rowsPerPage, orderBy, order, searchTerm, filter, startDate, endDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = () => {
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleDateFilterClick = (event) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateFilterClose = () => {
    setDateAnchorEl(null);
  };

  const applyFilter = (type, value) => {
    setFilter({ type, value });
    setActiveFilters(1);
    setFilterAnchorEl(null);
    setPage(0);
  };

  const applyDateFilter = () => {
    if (startDate && endDate) {
      setActiveFilters(prev => filter ? prev : prev + 1);
      setDateAnchorEl(null);
      setPage(0);
    }
  };

  const clearFilters = () => {
    setFilter(null);
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setActiveFilters(0);
    setPage(0);
  };

  const getPriorityColor = (priority) => {
    return priorityColors[priority] || '#757575';
  };

  const getPriorityIcon = (priority) => {
    return <FlagIcon style={{ color: getPriorityColor(priority) }} />;
  };

  const filterOpen = Boolean(filterAnchorEl);
  const dateFilterOpen = Boolean(dateAnchorEl);

  // Risk indicator component
  const RiskIndicator = ({ score, size = 'small' }) => {
    let color = '#66bb6a'; // Green for low risk
    if (score > 70) color = '#f44336'; // Red for high risk 
    else if (score > 40) color = '#ff9800'; // Orange for medium risk
    
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
          background: `radial-gradient(circle, rgba(20,20,40,0.6) 0%, rgba(0,0,0,0.8) 100%)`,
          border: `2.5px solid ${color}`,
          color: 'white',
          boxShadow: `0 0 12px ${color}`,
          fontSize,
          fontWeight: 'bold',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '150%',
            height: '150%',
            background: `linear-gradient(135deg, ${color}50 0%, transparent 50%)`,
            top: '-25%',
            left: '-25%',
            opacity: 0.7,
          }
        }}
      >
        <Typography
          variant="inherit"
          sx={{
            position: 'relative',
            zIndex: 2,
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {score}%
        </Typography>
      </Box>
    );
  };

  return (
    <GlassCard sx={{ transition: 'none' }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" component="h2">
            Task List
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ 
                minWidth: 200,
                transition: 'none',
                '& .MuiOutlinedInput-root': {
                  transition: 'none',
                  '& fieldset': {
                    transition: 'none'
                  },
                  '&:hover fieldset': {
                    transition: 'none'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => setSearchTerm('')}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              variant="outlined"
              size="small"
              onClick={handleFilterClick}
              startIcon={
                activeFilters > 0 ? (
                  <Badge badgeContent={activeFilters} color="error">
                    <FilterListIcon />
                  </Badge>
                ) : (
                  <FilterListIcon />
                )
              }
              sx={{ transition: 'none' }}
            >
              Filter
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              onClick={handleDateFilterClick}
              startIcon={<CalendarIcon />}
              sx={{ transition: 'none' }}
            >
              Date
            </Button>
            
            {activeFilters > 0 && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                sx={{ transition: 'none' }}
              >
                Clear Filters
              </Button>
            )}
            
            <IconButton onClick={() => loadTasks()} sx={{ transition: 'none' }}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TableContainer component={Paper} sx={{ 
          bgcolor: 'rgba(0,0,0,0.2)', 
          backdropFilter: 'blur(10px)',
          transition: 'none' 
        }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'task_name'}
                    direction={orderBy === 'task_name' ? order : 'asc'}
                    onClick={() => handleSort('task_name')}
                    sx={{ transition: 'none' }}
                  >
                    Task Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'time_taken'}
                    direction={orderBy === 'time_taken' ? order : 'asc'}
                    onClick={() => handleSort('time_taken')}
                    sx={{ transition: 'none' }}
                  >
                    Time Taken
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'priority'}
                    direction={orderBy === 'priority' ? order : 'asc'}
                    onClick={() => handleSort('priority')}
                    sx={{ transition: 'none' }}
                  >
                    Priority
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleSort('status')}
                    sx={{ transition: 'none' }}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'prediction_score'}
                    direction={orderBy === 'prediction_score' ? order : 'asc'}
                    onClick={() => handleSort('prediction_score')}
                    sx={{ transition: 'none' }}
                  >
                    Prediction Score
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'created_at'}
                    direction={orderBy === 'created_at' ? order : 'asc'}
                    onClick={() => handleSort('created_at')}
                    sx={{ transition: 'none' }}
                  >
                    Created At
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading tasks...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No tasks found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {filter ? 'Try changing your filter settings' : 'Create some tasks to get started'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.task_name}</TableCell>
                    <TableCell>{formatTime(task.time_taken)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        icon={getPriorityIcon(task.priority)}
                        sx={{ 
                          bgcolor: `${getPriorityColor(task.priority)}22`,
                          color: getPriorityColor(task.priority),
                          borderColor: getPriorityColor(task.priority),
                          fontWeight: 'bold',
                          transition: 'none'
                        }}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={statusColors[task.status] || 'default'}
                        icon={<StatusIcon status={task.status} />}
                        label={task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        sx={{ transition: 'none' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <RiskIndicator score={task.prediction_score} />
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(task.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>
      
      {/* Status and Priority Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={filterOpen}
        onClose={handleFilterClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            minWidth: 180, 
            maxWidth: 300,
            '& .MuiMenuItem-root': {
              transition: 'none'
            }
          },
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Filter by Status</Typography>
        </MenuItem>
        <MenuItem onClick={() => applyFilter('status', 'completed')} sx={{ transition: 'none' }}>
          <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
          Completed
        </MenuItem>
        <MenuItem onClick={() => applyFilter('status', 'in_progress')} sx={{ transition: 'none' }}>
          <TimeIcon fontSize="small" color="warning" sx={{ mr: 1 }} />
          In Progress
        </MenuItem>
        <MenuItem onClick={() => applyFilter('status', 'pending')} sx={{ transition: 'none' }}>
          <PendingIcon fontSize="small" color="info" sx={{ mr: 1 }} />
          Pending
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem disabled>
          <Typography variant="subtitle2">Filter by Priority</Typography>
        </MenuItem>
        <MenuItem onClick={() => applyFilter('priority', 'critical')} sx={{ transition: 'none' }}>
          <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors.critical }} />
          Critical
        </MenuItem>
        <MenuItem onClick={() => applyFilter('priority', 'high')} sx={{ transition: 'none' }}>
          <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors.high }} />
          High
        </MenuItem>
        <MenuItem onClick={() => applyFilter('priority', 'medium')} sx={{ transition: 'none' }}>
          <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors.medium }} />
          Medium
        </MenuItem>
        <MenuItem onClick={() => applyFilter('priority', 'low')} sx={{ transition: 'none' }}>
          <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors.low }} />
          Low
        </MenuItem>

        <Divider sx={{ my: 1 }} />
        
        <MenuItem disabled>
          <Typography variant="subtitle2">Filter by Risk Level</Typography>
        </MenuItem>
        <MenuItem onClick={() => applyFilter('risk', 'high')} sx={{ transition: 'none' }}>
          <WarningIcon fontSize="small" sx={{ mr: 1, color: '#f44336' }} />
          High Risk ({'>'}70%)
        </MenuItem>
        <MenuItem onClick={() => applyFilter('risk', 'medium')} sx={{ transition: 'none' }}>
          <WarningIcon fontSize="small" sx={{ mr: 1, color: '#ff9800' }} />
          Medium Risk (40-70%)
        </MenuItem>
        <MenuItem onClick={() => applyFilter('risk', 'low')} sx={{ transition: 'none' }}>
          <WarningIcon fontSize="small" sx={{ mr: 1, color: '#66bb6a' }} />
          Low Risk ({'<'}40%)
        </MenuItem>
      </Menu>
      
      {/* Date Filter Popover */}
      <Popover
        open={dateFilterOpen}
        anchorEl={dateAnchorEl}
        onClose={handleDateFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: { 
            p: 2, 
            width: 300,
            transition: 'none'
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Filter by Date Range
        </Typography>
        
        <Stack spacing={2}>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          
          <TextField
            label="End Date"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          
          <Button
            variant="contained"
            onClick={applyDateFilter}
            disabled={!startDate || !endDate}
            sx={{ transition: 'none' }}
          >
            Apply Filter
          </Button>
        </Stack>
      </Popover>
    </GlassCard>
  );
};

export default TaskList; 