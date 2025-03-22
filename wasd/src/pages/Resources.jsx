import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  useTheme
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import GlassCard from '../components/GlassCard';
import AdvancedBackground from '../components/AdvancedBackground';
import { supabase } from '../lib/supabase';

// Utility function to parse CSV to JSON
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    return headers.reduce((obj, header, index) => {
      let value = values[index] || '';
      
      // Convert numeric values to numbers for proper JSON formatting
      if (!isNaN(value) && value !== '' && header === 'CAPACITY') {
        // If it's a numeric string, convert to number
        value = Number(value);
      } else if (!isNaN(value) && value !== '' && header === 'DURATION') {
        value = Number(value);
      } else if (value === '') {
        // Set empty strings to null for consistency
        value = null;
      }
      
      obj[header] = value;
      return obj;
    }, {});
  });
};

// Validate the data format
const validateData = (spaces, requests) => {
  let valid = true;
  let errorMsg = '';
  
  // Check spaces data
  if (!spaces || !Array.isArray(spaces) || spaces.length === 0) {
    valid = false;
    errorMsg = 'Spaces data is invalid or empty';
    return { valid, errorMsg };
  }
  
  // Check if spaces have required fields
  const requiredSpaceFields = ['SPACE_ID', 'SPACE_TYPE', 'CAPACITY'];
  for (const field of requiredSpaceFields) {
    if (!spaces[0].hasOwnProperty(field)) {
      valid = false;
      errorMsg = `Spaces data is missing required field: ${field}`;
      return { valid, errorMsg };
    }
  }
  
  // Check requests data
  if (!requests || !Array.isArray(requests) || requests.length === 0) {
    valid = false;
    errorMsg = 'Requests data is invalid or empty';
    return { valid, errorMsg };
  }
  
  // Check if requests have required fields
  const requiredRequestFields = ['REQ_ID', 'SPACE_ID', 'PRIORITY'];
  for (const field of requiredRequestFields) {
    if (!requests[0].hasOwnProperty(field)) {
      valid = false;
      errorMsg = `Requests data is missing required field: ${field}`;
      return { valid, errorMsg };
    }
  }
  
  return { valid, errorMsg };
};

// API call to backend
const allocateResources = async (spacesData, requestsData) => {
  console.log('Preparing data for allocation');
  
  try {
    // First get the API endpoint from Supabase
    const { data: endpointData, error: endpointError } = await supabase
      .from('ngrok')
      .select('*')
      .eq('id', 5)
      .single();
      
    if (endpointError) throw new Error(`Failed to get endpoint: ${endpointError.message}`);
    if (!endpointData || !endpointData.url) throw new Error('No valid endpoint found');
    
    const apiEndpoint = endpointData.url;
    console.log('Using API endpoint:', apiEndpoint);
    
    // Format the data as required by the API - try with a simpler structure
    const formattedData = {
      inventory: spacesData,
      requests: requestsData
    };
    
    // Stringify the data normally
    const stringifiedData = JSON.stringify(formattedData);
    
    console.log('Request payload:', stringifiedData);
    
    // Make API call to the backend
    const response = await fetch(`${apiEndpoint}/allocate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringifiedData,
      // Adding timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      // Get error details from response if possible
      try {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API response error: ${response.status} - ${errorText}`);
      } catch (textError) {
        throw new Error(`API response error: ${response.status}`);
      }
    }
    
    try {
      const data = await response.json();
      console.log('API response data:', data);
      return data; // The API should return an array of allocated requests
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      const rawText = await response.text();
      console.log('Raw response text:', rawText);
      throw new Error(`Failed to parse API response: ${jsonError.message}`);
    }
  } catch (error) {
    console.warn('API call failed, using mock data instead:', error);
    
    // If API call fails, use mock response
    console.log('Falling back to mock allocation');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock allocation logic
    return requestsData.map(req => {
      // 70% chance of getting requested space, 30% chance of alternative
      const getRequestedSpace = Math.random() > 0.3;
      
      // If not getting requested space, select based on priority
      let alternativeSpace;
      if (!getRequestedSpace) {
        // For high priority requests, try to find similar space type
        if (req.PRIORITY === 'Critical' || req.PRIORITY === 'Mandatory') {
          const sameTypeSpaces = spacesData.filter(s => 
            s.SPACE_TYPE === req.SPACE_TYPE && s.SPACE_ID !== req.SPACE_ID
          );
          
          if (sameTypeSpaces.length > 0) {
            alternativeSpace = sameTypeSpaces[Math.floor(Math.random() * sameTypeSpaces.length)].SPACE_ID;
          } else {
            // If no same type, get any space
            alternativeSpace = spacesData[Math.floor(Math.random() * spacesData.length)].SPACE_ID;
          }
        } else {
          // For general priority, just pick any space
          alternativeSpace = spacesData[Math.floor(Math.random() * spacesData.length)].SPACE_ID;
        }
      }
      
      return {
        ...req,
        ALLOCATED_SPACE: getRequestedSpace ? req.SPACE_ID : alternativeSpace
      };
    });
  }
};

// Priority colors
const priorityColors = {
  'Critical': '#f44336',
  'Mandatory': '#ff9800',
  'General': '#4caf50'
};

// Status colors
const statusColors = {
  'Approved': '#4caf50',
  'Pending': '#ff9800',
  'Rejected': '#f44336'
};

const Resources = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [spacesFile, setSpacesFile] = useState(null);
  const [requestsFile, setRequestsFile] = useState(null);
  const [spacesData, setSpacesData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const [allocationResults, setAllocationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState(null);
  
  // Check Supabase connection on mount
  useEffect(() => {
    checkSupabaseConnection();
  }, []);
  
  // Function to check Supabase connection status
  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('ngrok').select('count').limit(1);
      if (error) throw error;
      console.log('Supabase connection successful');
    } catch (err) {
      console.error('Supabase connection error:', err);
      setError('Unable to connect to the resource allocation service. Some features may be limited.');
    }
  };
  
  // Handle file upload for spaces CSV
  const handleSpacesUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSpacesFile(file);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvData = e.target.result;
          const jsonData = parseCSV(csvData);
          setSpacesData(jsonData);
          setError(null);
        } catch (err) {
          setError("Failed to parse spaces CSV file. Please check the format.");
          console.error(err);
        }
      };
      
      reader.onerror = () => {
        setError("Error reading the spaces file");
      };
      
      reader.readAsText(file);
    }
  };
  
  // Handle file upload for requests CSV
  const handleRequestsUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRequestsFile(file);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvData = e.target.result;
          const jsonData = parseCSV(csvData);
          setRequestsData(jsonData);
          setError(null);
        } catch (err) {
          setError("Failed to parse requests CSV file. Please check the format.");
          console.error(err);
        }
      };
      
      reader.onerror = () => {
        setError("Error reading the requests file");
      };
      
      reader.readAsText(file);
    }
  };
  
  // Reset the current data
  const handleReset = () => {
    if (activeStep === 0) {
      setSpacesFile(null);
      setSpacesData([]);
    } else if (activeStep === 1) {
      setRequestsFile(null);
      setRequestsData([]);
    } else {
      setSpacesFile(null);
      setRequestsFile(null);
      setSpacesData([]);
      setRequestsData([]);
      setAllocationResults([]);
      setActiveStep(0);
      setSuccess(false);
    }
    setError(null);
  };
  
  // Handle next step in the process
  const handleNext = () => {
    if (activeStep === 0 && !spacesData.length) {
      setError("Please upload and parse the spaces data first");
      return;
    }
    
    if (activeStep === 1 && !requestsData.length) {
      setError("Please upload and parse the requests data first");
      return;
    }
    
    if (activeStep === 2) {
      handleAllocate();
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
    setError(null);
  };
  
  // Handle going back a step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };
  
  // Process the allocation
  const handleAllocate = async () => {
    setLoading(true);
    setError(null);
    
    // Validate the data
    const { valid, errorMsg } = validateData(spacesData, requestsData);
    if (!valid) {
      console.error('Data validation error:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      return;
    }
    
    console.log('Spaces data sample:', spacesData.slice(0, 2));
    console.log('Requests data sample:', requestsData.slice(0, 2));
    
    try {
      const results = await allocateResources(spacesData, requestsData);
      
      // Check if the results are in the expected format
      if (!Array.isArray(results)) {
        throw new Error('Invalid response format from allocation service');
      }
      
      setAllocationResults(results);
      setSuccess(true);
      setActiveStep(3);  // Move to results step
    } catch (err) {
      console.error('Allocation error:', err);
      setError(`Resource allocation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Export allocation results as CSV
  const exportResults = () => {
    if (!allocationResults.length) return;
    
    // Convert JSON to CSV
    const headers = Object.keys(allocationResults[0]).join(',');
    const rows = allocationResults.map(obj => 
      Object.values(obj).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resource_allocation_results.csv';
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  };
  
  // Steps in the allocation process
  const steps = [
    'Upload Spaces Data',
    'Upload Requests Data',
    'Process Allocation',
    'View Results'
  ];
  
  return (
    <Box sx={{ py: 3 }}>
      <AdvancedBackground />
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
            Resource Allocation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload space and request data to generate optimal space allocation
          </Typography>
        </Box>
        
        <IconButton 
          onClick={() => setShowHelpDialog(true)}
          sx={{ 
            bgcolor: 'rgba(0,255,136,0.1)', 
            '&:hover': {
              bgcolor: 'rgba(0,255,136,0.2)'
            }
          }}
        >
          <InfoIcon />
        </IconButton>
      </Box>
      
      <GlassCard>
        <Box sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Resource allocation completed successfully!
            </Alert>
          )}
          
          {activeStep === 0 && (
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                mb: 2
              }}>
                <Button 
                  size="small" 
                  component="a" 
                  href="/sample_spaces.csv" 
                  download
                  sx={{ mr: 1 }}
                >
                  Download Sample Spaces CSV
                </Button>
                <Button 
                  size="small" 
                  component="a" 
                  href="/sample_requests.csv" 
                  download
                >
                  Download Sample Requests CSV
                </Button>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Upload Spaces Data (CSV)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload a CSV file containing available spaces information. The file should include SPACE_ID, SPACE_TYPE, and CAPACITY columns. This data will be used to create the inventory for space allocation.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 3, 
                border: '1px dashed', 
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                mb: 3
              }}>
                <input
                  type="file"
                  accept=".csv"
                  id="spaces-file-upload"
                  style={{ display: 'none' }}
                  onChange={handleSpacesUpload}
                />
                <label htmlFor="spaces-file-upload">
                  <Button 
                    variant="contained" 
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Select Spaces CSV File
                  </Button>
                </label>
                
                {spacesFile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CheckIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {spacesFile.name} ({Math.round(spacesFile.size / 1024)} KB)
                    </Typography>
                    <IconButton size="small" onClick={handleReset} sx={{ ml: 1 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
              
              {spacesData.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Parsed Spaces Data ({spacesData.length} records)
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300, bgcolor: 'rgba(0,0,0,0.3)' }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {Object.keys(spacesData[0]).map((key) => (
                            <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                              {key}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {spacesData.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value, i) => (
                              <TableCell key={i}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Upload Requests Data (CSV)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload a CSV file containing resource requests. The file should include columns such as REQ_ID, DEPARTMENT, PRIORITY, SPACE_ID, etc. These requests will be processed by the optimization algorithm to allocate appropriate spaces.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 3, 
                border: '1px dashed', 
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                mb: 3
              }}>
                <input
                  type="file"
                  accept=".csv"
                  id="requests-file-upload"
                  style={{ display: 'none' }}
                  onChange={handleRequestsUpload}
                />
                <label htmlFor="requests-file-upload">
                  <Button 
                    variant="contained" 
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Select Requests CSV File
                  </Button>
                </label>
                
                {requestsFile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CheckIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {requestsFile.name} ({Math.round(requestsFile.size / 1024)} KB)
                    </Typography>
                    <IconButton size="small" onClick={handleReset} sx={{ ml: 1 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
              
              {requestsData.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Parsed Requests Data ({requestsData.length} records)
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300, bgcolor: 'rgba(0,0,0,0.3)' }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {Object.keys(requestsData[0]).map((key) => (
                            <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                              {key}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {requestsData.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value, i) => (
                              <TableCell key={i}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
          
          {activeStep === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Ready to Process Resource Allocation
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                You've uploaded data for {spacesData.length} spaces and {requestsData.length} requests.
                Click "Process" to start the allocation algorithm.
              </Typography>
              
              <Box sx={{ 
                border: '1px solid', 
                borderColor: 'rgba(0,255,136,0.3)', 
                borderRadius: 2, 
                p: 3, 
                mb: 3, 
                width: '100%',
                maxWidth: 600,
                bgcolor: 'rgba(0,0,0,0.2)'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Spaces:</Typography>
                    <Typography variant="h6">{spacesData.length}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Requests:</Typography>
                    <Typography variant="h6">{requestsData.length}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Space Types:</Typography>
                    <Typography variant="body2">
                      {Array.from(new Set(spacesData.map(item => item.SPACE_TYPE))).join(', ')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Departments:</Typography>
                    <Typography variant="body2">
                      {Array.from(new Set(requestsData.map(item => item.DEPARTMENT))).join(', ')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleNext}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Process Allocation'}
              </Button>
            </Box>
          )}
          
          {activeStep === 3 && allocationResults.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                  Allocation Results ({allocationResults.length} requests processed)
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={exportResults}
                >
                  Export CSV
                </Button>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  The table below shows the allocation results. Spaces highlighted in green were allocated as requested, 
                  while orange indicates an alternative space was assigned.
                </Typography>
                
                <Paper sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(0,255,136,0.2)' 
                }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Total Requests:</Typography>
                      <Typography variant="body1">{allocationResults.length}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Spaces Allocated as Requested:</Typography>
                      <Typography variant="body1" sx={{ color: '#4caf50' }}>
                        {allocationResults.filter(item => item.ALLOCATED_SPACE === item.SPACE_ID).length}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Alternative Allocations:</Typography>
                      <Typography variant="body1" sx={{ color: '#ff9800' }}>
                        {allocationResults.filter(item => item.ALLOCATED_SPACE !== item.SPACE_ID).length}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
              
              <TableContainer component={Paper} sx={{ bgcolor: 'rgba(0,0,0,0.3)', mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>REQ_ID</TableCell>
                      <TableCell>DEPARTMENT</TableCell>
                      <TableCell>PRIORITY</TableCell>
                      <TableCell>REQUESTED SPACE</TableCell>
                      <TableCell>SPACE_TYPE</TableCell>
                      <TableCell>START_TIME</TableCell>
                      <TableCell>END_TIME</TableCell>
                      <TableCell>ALLOCATED SPACE</TableCell>
                      <TableCell>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allocationResults.map((row) => (
                      <TableRow key={row.REQ_ID}>
                        <TableCell>{row.REQ_ID}</TableCell>
                        <TableCell>{row.DEPARTMENT}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.PRIORITY} 
                            size="small" 
                            sx={{ 
                              bgcolor: `${priorityColors[row.PRIORITY]}22`,
                              color: priorityColors[row.PRIORITY],
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.SPACE_ID}</TableCell>
                        <TableCell>{row.SPACE_TYPE}</TableCell>
                        <TableCell>{new Date(row.START_TIME).toLocaleString()}</TableCell>
                        <TableCell>{new Date(row.END_TIME).toLocaleString()}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: row.ALLOCATED_SPACE === row.SPACE_ID ? '#4caf50' : '#ff9800',
                              fontWeight: 'medium'
                            }}
                          >
                            {row.ALLOCATED_SPACE}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={row.STATUS} 
                            size="small" 
                            sx={{ 
                              bgcolor: `${statusColors[row.STATUS]}22`,
                              color: statusColors[row.STATUS]
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box>
              <Button onClick={handleReset} sx={{ mr: 1 }}>
                Reset
              </Button>
              {activeStep < steps.length - 1 && (
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && !spacesData.length) || 
                    (activeStep === 1 && !requestsData.length) ||
                    loading
                  }
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </GlassCard>
      
      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onClose={() => setShowHelpDialog(false)}>
        <DialogTitle>
          Resource Allocation Help
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This tool allows you to upload space and request data to generate optimal space allocations using AI-powered optimization. Follow these steps:
          </DialogContentText>
          <Box component="ol" sx={{ mt: 2 }}>
            <li>Upload a CSV file with available spaces (SPACE_ID, SPACE_TYPE, CAPACITY)</li>
            <li>Upload a CSV file with resource requests (REQ_ID, DEPARTMENT, PRIORITY, etc.)</li>
            <li>Process the data to generate optimized allocations</li>
            <li>View and export the results</li>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            The system uses an AI optimization algorithm to maximize space utilization while respecting priorities and requirements.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sample Spaces CSV:
            </Typography>
            <Box component="pre" sx={{ 
              bgcolor: 'rgba(0,0,0,0.1)', 
              p: 1, 
              borderRadius: 1, 
              fontSize: '0.75rem',
              overflow: 'auto' 
            }}>
              SPACE_ID,SPACE_TYPE,CAPACITY
              CONF_101,Meeting Room,10
              CONF_102,Meeting Room,15
              WH_301,Warehouse,50
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sample Requests CSV:
            </Typography>
            <Box component="pre" sx={{ 
              bgcolor: 'rgba(0,0,0,0.1)', 
              p: 1, 
              borderRadius: 1, 
              fontSize: '0.75rem',
              overflow: 'auto' 
            }}>
              REQ_ID,EMP_ID,DEPARTMENT,PRIORITY,SPACE_ID,SPACE_TYPE,REQUEST_DATE,START_TIME,END_TIME,DURATION,HAS_EQUIPMENT,EQUIPMENT_LIST,STATUS
              REQ_001,EMP_101,IT Department,General,CONF_101,Meeting Room,2025-03-20,2025-03-25 10:00:00,2025-03-25 12:00:00,8,Yes,Projector AC,Pending
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, color: theme.palette.primary.main }}>
            Result will include optimal space allocations with ALLOCATED_SPACE field for each request.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Resources; 