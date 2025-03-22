import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Home from './pages/Home';
import TaskOverview from './pages/TaskOverview';
import Sidebar from './components/Sidebar';
import Facility from './pages/Facility';
import Maintenance from './pages/Maintenance';
import Analytics from './pages/Analytics';
import AskAI from './pages/AskAI';
import Resources from './pages/Resources';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: 'rgba(0, 0, 0, 0.7)',
    },
    primary: {
      main: '#00ff88',
    },
    secondary: {
      main: '#00b4d8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const drawerWidth = 260;

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box 
          component="main"
          sx={{ 
            flexGrow: 1,
            width: `calc(100% - ${drawerWidth}px)`,
            minHeight: '100vh',
            p: 3,
            pl: 0
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/taskoverview" element={<TaskOverview />} />
            <Route path="/facility" element={<Facility />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/askai" element={<AskAI />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
