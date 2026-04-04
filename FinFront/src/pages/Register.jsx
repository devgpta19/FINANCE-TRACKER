import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, CircularProgress, Link, MenuItem } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/apiClient';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await apiClient.post('/auth/register', { name, email, password, role });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <Container maxWidth="xs">
        <Paper elevation={0} className="glass-panel" sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" className="gradient-text" sx={{ fontWeight: 'bold', mb: 1 }}>
              Join FinTrack
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create an account to start tracking
            </Typography>
          </Box>
          
          {success ? (
            <Box textAlign="center" py={4}>
               <Typography color="success.main" variant="h6">Registration Successful!</Typography>
               <Typography variant="body2" mt={1}>Redirecting to login...</Typography>
            </Box>
          ) : (
            <form onSubmit={handleRegister}>
                <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                select
                name="role"
                label="Role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="VIEWER">Viewer</MenuItem>
                </TextField>
                
                {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    {error}
                </Typography>
                )}

                <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                className="hover-lift"
                >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
                
                <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: 'bold' }}>
                    Sign in
                    </Link>
                </Typography>
                </Box>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
