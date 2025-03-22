import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  Avatar, 
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AskAI = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: 'Hello! I\'m Arya, your facility management assistant. How can I help you today?',
      timestamp: new Date(),
      isPath: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch the API endpoint on component mount
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError('Chat service is not configured. Please check environment variables.');
      return;
    }
    
    fetchApiEndpoint();
    // Fetch endpoint every minute to ensure we have the latest URL
    const interval = setInterval(fetchApiEndpoint, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchApiEndpoint = async () => {
    try {
      // Fetch API endpoint from Supabase
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
      setError('Failed to connect to chat service.');
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleNavigation = (path) => {
    if (path.startsWith('/')) {
      navigate(path);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date(),
      isPath: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`${apiEndpoint}/askai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_query: input }),
      });

      if (!response.ok) throw new Error('API response was not ok');

      const data = await response.json();
      
      // Only display tool_calls if they exist
      let responseText = '';
      if (data && data.tool_calls) {
        // Just display the tool_calls value
        responseText = JSON.stringify(data.tool_calls);
      } else {
        responseText = 'No tool calls found';
      }
      
      // Handle the response
      setMessages(prev => [...prev, { 
        id: prev.length + 1,
        text: responseText,
        sender: 'ai',
        isPath: false,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Error fetching response:', err);
      setMessages(prev => [...prev, { 
        id: prev.length + 1,
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'ai',
        isPath: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const clearChat = () => {
    setMessages([
      { 
        id: 1, 
        sender: 'ai', 
        text: 'Hello! I\'m Arya, your facility management assistant. How can I help you today?',
        timestamp: new Date(),
        isPath: false
      }
    ]);
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 24px)',
      mt: -3, // Offset the parent container's padding
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Paper 
        elevation={0}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(10, 10, 10, 0.95)',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: 0
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 3, 
          py: 1.5, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0,
          bgcolor: 'rgba(0, 0, 0, 0.4)'
        }}>
          <Typography variant="h6" sx={{ 
            background: 'linear-gradient(45deg, #00ff88, #00b4d8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <SmartToyIcon /> Arya - Facility AI Assistant
          </Typography>
          <IconButton onClick={clearChat} color="error" size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
        
        <List 
          sx={{ 
            flex: 1,
            overflowY: 'auto',
            p: 3,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 255, 136, 0.5)',
              borderRadius: '4px',
            }
          }}
        >
          {error && (
            <Paper
              sx={{
                p: 2,
                mb: 2,
                bgcolor: 'rgba(255, 0, 0, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(255, 0, 0, 0.2)',
              }}
            >
              <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
                {error}
              </Typography>
            </Paper>
          )}
          
          {messages.map((message) => (
            <ListItem 
              key={message.id} 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 3,
                px: 0
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                maxWidth: '70%'
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: message.sender === 'ai' ? '#00ff88' : '#00b4d8',
                    width: 36,
                    height: 36,
                    mr: message.sender === 'user' ? 0 : 1,
                    ml: message.sender === 'user' ? 1 : 0
                  }}
                >
                  {message.sender === 'ai' ? <SmartToyIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                </Avatar>
                <Paper 
                  elevation={1} 
                  component={message.isPath ? "button" : "div"}
                  onClick={() => message.isPath && handleNavigation(message.text)}
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    bgcolor: message.sender === 'ai' 
                      ? 'rgba(0, 255, 136, 0.1)' 
                      : 'rgba(0, 180, 216, 0.1)',
                    border: message.sender === 'ai' 
                      ? '1px solid rgba(0, 255, 136, 0.3)' 
                      : '1px solid rgba(0, 180, 216, 0.3)',
                    maxWidth: '100%',
                    cursor: message.isPath ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    '&:hover': message.isPath ? {
                      bgcolor: 'rgba(0, 255, 136, 0.2)',
                      transform: 'translateY(-2px)',
                    } : {},
                    all: 'unset',
                    display: 'block',
                    width: '100%'
                  }}
                >
                  <Typography variant="body1" sx={{ 
                    wordBreak: 'break-word',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    ...(message.isPath && {
                      color: '#00ff88',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '"→"',
                        mr: 1,
                        fontSize: '1.1rem'
                      }
                    })
                  }}>
                    {message.isPath ? message.displayText : message.text}
                  </Typography>
                </Paper>
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 0.5, 
                  color: 'text.secondary',
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mr: message.sender === 'user' ? 4 : 0,
                  ml: message.sender === 'user' ? 0 : 4
                }}
              >
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </ListItem>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#00ff88', width: 36, height: 36 }}>
                <SmartToyIcon fontSize="small" />
              </Avatar>
              <CircularProgress size={24} sx={{ color: '#00ff88' }} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </List>
        
        <Divider />
        
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center',
          gap: 1.5,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0,
          bgcolor: 'rgba(0, 0, 0, 0.3)'
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={error ? "Chat service unavailable..." : "Type your question here..."}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!!error}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 255, 136, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00ff88',
                },
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={input.trim() === '' || isLoading || !!error}
            sx={{ 
              borderRadius: 3,
              minWidth: '52px',
              width: '52px',
              height: '52px',
              p: 0
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AskAI; 