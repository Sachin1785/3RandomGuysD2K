import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import GlassCard from './GlassCard';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default color palette with Matrix theme colors
const DEFAULT_COLORS = [
  '#00ff88', // Primary green
  '#00b4d8', // Secondary blue
  '#f57c00', // Orange
  '#d32f2f', // Red
  '#ffeb3b', // Yellow
  '#9c27b0', // Purple
  '#00e676', // Light green
  '#03a9f4', // Light blue
  '#e91e63', // Pink
  '#ff9800', // Light orange
];

/**
 * DynamicChart - A universal chart component that accepts JSON data and renders appropriate charts
 * 
 * @param {Object} props Component props
 * @param {string} props.type Chart type: 'line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea'
 * @param {Array|Object} props.data JSON data to visualize
 * @param {string} props.labelKey Key in the data object to use for labels (x-axis)
 * @param {Array} props.dataKeys Array of keys to extract data series from
 * @param {Array} props.dataLabels Array of labels for each data series
 * @param {string} props.title Chart title
 * @param {boolean} props.stacked Whether bars should be stacked (bar chart only)
 * @param {Object} props.customOptions Additional Chart.js options
 * @param {number} props.height Chart height in pixels
 * @param {boolean} props.loading Loading state
 * @param {string} props.error Error message
 * @param {Array} props.colors Custom color palette
 * @param {boolean} props.fill Whether area under line should be filled (line chart only)
 * @param {number} props.tension Line tension (curvature) between 0 and 1
 */
const DynamicChart = ({
  type = 'line',
  data = [],
  labelKey = 'label',
  dataKeys = ['value'],
  dataLabels = [],
  title = '',
  stacked = false,
  customOptions = {},
  height = 300,
  loading = false,
  error = null,
  colors = DEFAULT_COLORS,
  fill = true,
  tension = 0.4
}) => {
  const theme = useTheme();

  // Get appropriate background color based on chart type
  const getBackgroundColor = (color, chartType) => {
    if (Array.isArray(color)) {
      return color.map(c => {
        if (['pie', 'doughnut', 'polarArea'].includes(chartType)) {
          return `${c}CC`; // Semi-transparent
        } else if (chartType === 'bar') {
          return `${c}99`; // More transparent
        } else if (chartType === 'line') {
          return fill ? `${c}33` : 'transparent'; // Very transparent if filled
        }
        return c;
      });
    }
    
    if (['pie', 'doughnut', 'polarArea'].includes(chartType)) {
      return `${color}CC`; // Semi-transparent
    } else if (chartType === 'bar') {
      return `${color}99`; // More transparent
    } else if (chartType === 'line') {
      return fill ? `${color}33` : 'transparent'; // Very transparent if filled
    }
    return color;
  };

  // Get appropriate border color based on chart type
  const getBorderColor = (color, chartType) => {
    if (Array.isArray(color)) {
      return color;
    }
    return color;
  };

  // Process array data format
  const processArrayData = (dataArray) => {
    if (!dataArray || dataArray.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Extract labels from data
    const labels = dataArray.map(item => 
      typeof item === 'object' && item !== null ? item[labelKey] || '' : ''
    );

    // Create datasets
    const datasets = dataKeys.map((key, index) => {
      const color = colors[index % colors.length];
      
      return {
        label: dataLabels[index] || key,
        data: dataArray.map(item => 
          typeof item === 'object' && item !== null ? item[key] || 0 : 0
        ),
        backgroundColor: getBackgroundColor(color, type),
        borderColor: getBorderColor(color, type),
        borderWidth: type === 'line' ? 2 : 1,
        tension: type === 'line' ? tension : undefined,
        fill: type === 'line' ? fill : undefined,
        pointBackgroundColor: type === 'line' ? color : undefined,
        pointBorderColor: type === 'line' ? theme.palette.background.default : undefined,
        pointRadius: type === 'line' ? 4 : undefined,
        pointHoverRadius: type === 'line' ? 6 : undefined,
      };
    });

    return { labels, datasets };
  };

  // Process object data format (e.g., {key1: value1, key2: value2})
  const processObjectData = (dataObject) => {
    if (!dataObject || Object.keys(dataObject).length === 0) {
      return { labels: [], datasets: [] };
    }

    // Extract keys and values
    const labels = Object.keys(dataObject);
    
    let datasets = [];
    
    // If dataObject contains nested objects with multiple values
    if (labels.length > 0 && typeof dataObject[labels[0]] === 'object' && dataObject[labels[0]] !== null) {
      // Each key in dataKeys represents a property in the nested objects
      dataKeys.forEach((key, index) => {
        const color = colors[index % colors.length];
        
        datasets.push({
          label: dataLabels[index] || key,
          data: labels.map(label => 
            dataObject[label] && typeof dataObject[label] === 'object' && dataObject[label] !== null
              ? dataObject[label][key] || 0 
              : 0
          ),
          backgroundColor: getBackgroundColor(color, type),
          borderColor: getBorderColor(color, type),
          borderWidth: type === 'line' ? 2 : 1,
          tension: type === 'line' ? tension : undefined,
          fill: type === 'line' ? fill : undefined,
          pointBackgroundColor: type === 'line' ? color : undefined,
          pointBorderColor: type === 'line' ? theme.palette.background.default : undefined,
          pointRadius: type === 'line' ? 4 : undefined,
          pointHoverRadius: type === 'line' ? 6 : undefined,
        });
      });
    } else {
      // Simple key-value object
      const backgroundColors = labels.map((_, i) => getBackgroundColor(colors[i % colors.length], type));
      const borderColors = labels.map((_, i) => getBorderColor(colors[i % colors.length], type));
      
      datasets = [{
        label: dataLabels[0] || 'Value',
        data: Object.values(dataObject),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: type === 'line' ? 2 : 1,
        tension: type === 'line' ? tension : undefined,
        fill: type === 'line' ? fill : undefined,
      }];
    }

    return { labels, datasets };
  };

  // Process the data based on its type, memoized to prevent excessive re-renders
  const chartData = useMemo(() => {
    if (!data || loading) {
      return { labels: [], datasets: [] };
    }
    
    try {
      return Array.isArray(data) 
        ? processArrayData(data) 
        : processObjectData(data);
    } catch (err) {
      console.error('Error processing chart data:', err);
      return { labels: [], datasets: [] };
    }
  }, [data, dataKeys, labelKey, type, colors, theme, tension, fill, loading]);

  // Default Chart.js options
  const options = useMemo(() => {
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#ffffff',
            font: {
              family: theme.typography.fontFamily,
            }
          },
        },
        title: {
          display: !!title,
          text: title,
          color: '#ffffff',
          font: {
            family: theme.typography.fontFamily,
            size: 16,
            weight: 'bold',
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#00ff88',
          bodyColor: '#ffffff',
          borderColor: 'rgba(0, 255, 136, 0.3)',
          borderWidth: 1,
          padding: 10,
          titleFont: {
            family: theme.typography.fontFamily,
          },
          bodyFont: {
            family: theme.typography.fontFamily,
          },
          usePointStyle: true
        }
      },
      scales: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea' ? {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#ffffff',
            font: {
              family: theme.typography.fontFamily,
            }
          },
          stacked: stacked
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#ffffff',
            font: {
              family: theme.typography.fontFamily,
            }
          },
          stacked: stacked
        }
      } : undefined
    };
    
    return { ...defaultOptions, ...customOptions };
  }, [theme, title, type, stacked, customOptions]);

  // Render appropriate chart based on type
  const renderChart = () => {
    const props = { data: chartData, options, height };
    
    switch (type) {
      case 'bar':
        return <Bar {...props} />;
      case 'pie':
        return <Pie {...props} />;
      case 'doughnut':
        return <Doughnut {...props} />;
      case 'radar':
        return <Radar {...props} />;
      case 'polarArea':
        return <PolarArea {...props} />;
      case 'line':
      default:
        return <Line {...props} />;
    }
  };

  if (loading) {
    return (
      <GlassCard>
        <Box sx={{ p: 2, height: height }}>
          <Typography variant="subtitle1" gutterBottom>{title}</Typography>
          <Skeleton variant="rectangular" height={height - 60} width="100%" 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        </Box>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height, p: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <Box sx={{ p: 2, height: height }}>
        {renderChart()}
      </Box>
    </GlassCard>
  );
};

export default DynamicChart; 