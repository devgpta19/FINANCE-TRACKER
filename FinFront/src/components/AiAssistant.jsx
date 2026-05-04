import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Fab, Paper, Typography, TextField, IconButton, 
  List, ListItem, ListItemText, Avatar, CircularProgress,
  Zoom, Fade, useTheme
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Close as CloseIcon, 
  Send as SendIcon,
  SmartToy as RobotIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import apiClient from '../api/apiClient';

const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your FinTrack Assistant. How can I help you with your finances today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const theme = useTheme();

  const handleToggle = () => setOpen(!open);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { message: userMessage });
      setMessages(prev => [...prev, { role: 'ai', text: response.data.reply }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab 
          color="primary" 
          aria-label="chat" 
          onClick={handleToggle}
          sx={{ 
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
          }}
        >
          {open ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Zoom>

      {/* Chat Window */}
      <Fade in={open}>
        <Paper 
          className="glass-panel"
          sx={{ 
            position: 'absolute', 
            bottom: 80, 
            right: 0, 
            width: { xs: '300px', sm: '380px' }, 
            height: '500px', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              <RobotIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>FinTrack AI</Typography>
              <Typography variant="caption" color="text.secondary">Always here to help</Typography>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box 
            ref={scrollRef}
            sx={{ 
              flexGrow: 1, 
              p: 2, 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {messages.map((msg, index) => (
              <Box 
                key={index} 
                sx={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Paper 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.role === 'user' ? 'white' : 'text.primary',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">Thinking...</Typography>
              </Box>
            )}
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Ask something..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: 'rgba(255,255,255,0.05)'
                  }
                }}
              />
              <IconButton 
                color="primary" 
                onClick={handleSend} 
                disabled={loading || !input.trim()}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AiAssistant;
