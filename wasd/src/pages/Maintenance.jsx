import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Stack,
  List,
  ListItem,
  IconButton,
  Chip
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
  Send as SendIcon
} from '@mui/icons-material';
import GlassCard from '../components/GlassCard';
import AdvancedBackground from '../components/AdvancedBackground';
import { supabase } from '../lib/supabase';

// Severity colors
const severityColors = {
  'Low': '#4caf50',
  'Medium': '#ff9800',
  'High': '#f44336',
  'Critical': '#9c27b0'
};

const Maintenance = () => {
  // Form state
  const [formData, setFormData] = useState({
    EquipmentType: '',
    IssueType: '',
    Location: '',
    MaintenanceMonth: 1,
    DelayDays: 0
  });
  
  // Location inputs
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  
  // API state
  const [apiEndpoint, setApiEndpoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  // History state
  const [history, setHistory] = useState([]);
  
  // Equipment types options
  const equipmentTypes = ['Generator', 'HVAC', 'Plumbing', 'Electrical Panel', 'Elevator', 'Lighting'];
  
  // Issue types options
  const issueTypes = ['Electrical', 'Mechanical', 'Structural', 'Hydraulic', 'Software', 'Cooling'];
  
  // Building options
  const buildings = ['Building_1', 'Building_2', 'Building_3', 'Building_4', 'Building_5'];
  
  // Floor options
  const floors = ['Floor_1', 'Floor_2', 'Floor_3', 'Floor_4', 'Floor_5'];
  
  // Fetch API endpoint on component mount
  useEffect(() => {
    fetchApiEndpoint();
    // Load history from localStorage
    const savedHistory = localStorage.getItem('maintenanceHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse saved history:', e);
      }
    }
  }, []);
  
  // Fetch API endpoint from Supabase
  const fetchApiEndpoint = async () => {
    try {
      const { data, error } = await supabase
        .from('ngrok')
        .select('*')
        .eq('id', 5)
        .single();
        
      if (error) throw error;
      
      if (data && data.url) {
        setApiEndpoint(data.url);
        setError(null);
      } else {
        throw new Error('No endpoint found');
      }
    } catch (err) {
      console.error('Error fetching API endpoint:', err);
      setError('Failed to connect to maintenance prediction service.');
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'MaintenanceMonth' || name === 'DelayDays' 
        ? parseInt(value, 10) 
        : value
    }));
  };
  
  // Handle building and floor changes
  const handleBuildingChange = (e) => {
    const value = e.target.value;
    setBuilding(value);
    updateLocation(value, floor);
  };

  const handleFloorChange = (e) => {
    const value = e.target.value;
    setFloor(value);
    updateLocation(building, value);
  };

  // Update the location in formData based on building and floor
  const updateLocation = (bldg, flr) => {
    if (bldg && flr) {
      const locationString = `${bldg}-${flr}`;
      setFormData(prev => ({
        ...prev,
        Location: locationString
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiEndpoint) {
      setError('API endpoint not available. Please try again later.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiEndpoint}/maintain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Format the result
      setResult({
        predictedCost: data['Predicted Cost'],
        predictedDowntime: data['Predicted DowntimeHours'],
        predictedLabor: data['Predicted LaborHours'],
        predictedSeverity: data['Predicted SeverityScore'],
        timestamp: new Date().toISOString(),
        request: { ...formData }
      });
      
      // Add to history
      const newHistory = [
        {
          id: Date.now(),
          ...formData,
          result: {
            predictedCost: data['Predicted Cost'],
            predictedDowntime: data['Predicted DowntimeHours'],
            predictedLabor: data['Predicted LaborHours'],
            predictedSeverity: data['Predicted SeverityScore']
          },
          timestamp: new Date().toISOString()
        },
        ...history
      ].slice(0, 10); // Keep only last 10 entries
      
      setHistory(newHistory);
      
      // Save to localStorage
      localStorage.setItem('maintenanceHistory', JSON.stringify(newHistory));
      
    } catch (err) {
      console.error('Error predicting maintenance:', err);
      setError(`Prediction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('maintenanceHistory');
  };
  
  // Remove a single history item
  const removeHistoryItem = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('maintenanceHistory', JSON.stringify(newHistory));
  };
  
  return (
    <Box sx={{ py: 3 }}>
      <AdvancedBackground />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
          Maintenance Prediction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Predict maintenance costs, downtime, and labor hours based on equipment data
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <GlassCard>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ConstructionIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Maintenance Parameters
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="equipment-type-label">Equipment Type</InputLabel>
                      <Select
                        labelId="equipment-type-label"
                        name="EquipmentType"
                        value={formData.EquipmentType}
                        label="Equipment Type"
                        onChange={handleInputChange}
                        required
                      >
                        {equipmentTypes.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="issue-type-label">Issue Type</InputLabel>
                      <Select
                        labelId="issue-type-label"
                        name="IssueType"
                        value={formData.IssueType}
                        label="Issue Type"
                        onChange={handleInputChange}
                        required
                      >
                        {issueTypes.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Location
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel id="building-label">Building</InputLabel>
                          <Select
                            labelId="building-label"
                            value={building}
                            label="Building"
                            onChange={handleBuildingChange}
                            required
                          >
                            {buildings.map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel id="floor-label">Floor</InputLabel>
                          <Select
                            labelId="floor-label"
                            value={floor}
                            label="Floor"
                            onChange={handleFloorChange}
                            required
                          >
                            {floors.map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="month-label">Maintenance Month</InputLabel>
                      <Select
                        labelId="month-label"
                        name="MaintenanceMonth"
                        value={formData.MaintenanceMonth}
                        label="Maintenance Month"
                        onChange={handleInputChange}
                        required
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <MenuItem key={month} value={month}>
                            {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Delay Days"
                      name="DelayDays"
                      type="number"
                      value={formData.DelayDays}
                      onChange={handleInputChange}
                      inputProps={{ min: 0, max: 30 }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading || !apiEndpoint}
                      sx={{ mt: 1, height: 56 }}
                      endIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                    >
                      {loading ? "Predicting..." : "Predict Maintenance"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </GlassCard>
                    
          <Box sx={{ mt: 3 }}>
            <GlassCard>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      Prediction History
                    </Typography>
                  </Box>
                  
                  {history.length > 0 && (
                    <Button 
                      variant="outlined" 
                      size="small"
                      color="error"
                      onClick={clearHistory}
                      startIcon={<DeleteIcon />}
                    >
                      Clear History
                    </Button>
                  )}
                </Box>
                
                {history.length === 0 ? (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No prediction history yet
                  </Typography>
                ) : (
                  <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {history.map((item) => (
                      <ListItem 
                        key={item.id}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => removeHistoryItem(item.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                        sx={{ 
                          border: '1px solid',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: 1,
                          mb: 1,
                          flexDirection: 'column',
                          alignItems: 'flex-start'
                        }}
                      >
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2">
                            {item.EquipmentType} - {item.IssueType}
                          </Typography>
                          <Chip 
                            label={item.result.predictedSeverity} 
                            size="small"
                            sx={{ 
                              bgcolor: `${severityColors[item.result.predictedSeverity]}30`,
                              color: severityColors[item.result.predictedSeverity],
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                          <Chip
                            icon={<AttachMoneyIcon fontSize="small" />}
                            label={`$${item.result.predictedCost.toFixed(2)}`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<TimerIcon fontSize="small" />}
                            label={`${item.result.predictedDowntime}h downtime`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<ScheduleIcon fontSize="small" />}
                            label={`${item.result.predictedLabor}h labor`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.timestamp).toLocaleString()}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </GlassCard>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {result && (
            <GlassCard>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Prediction Results
                </Typography>
                
                <Paper sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.4)' }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Equipment Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Equipment</Typography>
                        <Typography variant="body1">{result.request.EquipmentType}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Issue Type</Typography>
                        <Typography variant="body1">{result.request.IssueType}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Location</Typography>
                        <Typography variant="body1">
                          {result.request.Location.split('-').join(', ')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Maintenance Timing
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Month</Typography>
                        <Typography variant="body1">
                          {new Date(0, result.request.MaintenanceMonth - 1).toLocaleString('default', { month: 'long' })}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Delay</Typography>
                        <Typography variant="body1">{result.request.DelayDays} days</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                  
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Prediction Results
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <Chip
                        label={result.predictedSeverity}
                        sx={{
                          fontSize: '1.2rem',
                          height: 40,
                          px: 2,
                          bgcolor: `${severityColors[result.predictedSeverity]}30`,
                          color: severityColors[result.predictedSeverity],
                          fontWeight: 'bold',
                          mb: 1
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Predicted Severity Score
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Paper sx={{ 
                          p: 2, 
                          textAlign: 'center', 
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          border: '1px solid rgba(76, 175, 80, 0.2)'
                        }}>
                          <AttachMoneyIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            ${result.predictedCost.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Estimated Cost
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <Paper sx={{ 
                          p: 2, 
                          textAlign: 'center', 
                          bgcolor: 'rgba(33, 150, 243, 0.1)',
                          border: '1px solid rgba(33, 150, 243, 0.2)'
                        }}>
                          <TimerIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {result.predictedDowntime.toFixed(1)} hrs
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Downtime
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <Paper sx={{ 
                          p: 2, 
                          textAlign: 'center', 
                          bgcolor: 'rgba(255, 152, 0, 0.1)',
                          border: '1px solid rgba(255, 152, 0, 0.2)'
                        }}>
                          <ScheduleIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {result.predictedLabor.toFixed(1)} hrs
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Labor Hours
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Prediction made on {new Date(result.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </GlassCard>
          )}
          
          {!result && (
            <GlassCard>
              <Box sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: 400
              }}>
                <ConstructionIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, opacity: 0.6 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No Prediction Results Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
                  Fill out the maintenance parameters form and click "Predict Maintenance" 
                  to generate cost, downtime, and labor hour predictions.
                </Typography>
              </Box>
            </GlassCard>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Maintenance; 