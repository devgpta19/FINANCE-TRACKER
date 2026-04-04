import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Container } from '@mui/material';
import { Brightness4, Brightness7, Logout, Dashboard as DashIcon, ReceiptLong } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Floating Glass Navbar */}
      <Box sx={{ p: { xs: 1, md: 3 }, pb: 0 }}>
        <AppBar 
          position="static" 
          color="inherit" 
          elevation={0} 
          className="glass-nav"
          sx={{ 
            borderRadius: { xs: 2, md: 4 },
            overflow: 'hidden',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }} className="gradient-text">
                FinTrack
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              
              {/* Navigation Links */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, mr: 2, gap: 1 }}>
                <Button 
                    variant={location.pathname === '/dashboard' ? 'contained' : 'text'}
                    color="primary"
                    startIcon={<DashIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ borderRadius: '12px', '&:hover': { transform: 'none' } }}
                >
                  Dashboard
                </Button>
                <Button 
                    variant={location.pathname === '/records' ? 'contained' : 'text'}
                    color="primary"
                    startIcon={<ReceiptLong />}
                    onClick={() => navigate('/records')}
                    sx={{ borderRadius: '12px', '&:hover': { transform: 'none' } }}
                >
                  Records
                </Button>
              </Box>
              
              {/* Divider */}
              <Box sx={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', mx: 1, display: { xs: 'none', sm: 'block' } }} />

              {/* User Info */}
              <Typography variant="subtitle2" sx={{ mx: 1, display: { xs: 'none', md: 'block' }, color: 'text.secondary', fontWeight: 500 }}>
                {user?.email} <Box component="span" sx={{ opacity: 0.5 }}>({user?.role})</Box>
              </Typography>

              {/* Controls */}
              <IconButton sx={{ ml: 1, backgroundColor: 'rgba(150,150,150,0.1)' }} onClick={toggleTheme} color="inherit" size="small">
                {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
              </IconButton>

              <IconButton color="error" onClick={handleLogout} title="Logout" size="small" sx={{ ml: 1, backgroundColor: 'rgba(244,63,94,0.1)' }}>
                <Logout fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg" className="animate-fade-in">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
