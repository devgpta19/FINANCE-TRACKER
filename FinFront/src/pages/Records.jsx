import React, { useEffect, useState, useContext } from 'react';
import { 
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, CircularProgress, IconButton, Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import apiClient from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog State
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '', type: 'EXPENSE', categoryId: 1, date: new Date().toISOString().split('T')[0], description: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const { user } = useContext(AuthContext);
  // Backend role might be 'ROLE_ADMIN' or 'ADMIN'
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/records');
      setRecords(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch records.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
      if(response.data.length > 0) {
        setFormData(prev => ({...prev, categoryId: response.data[0].id}));
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchCategories();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await apiClient.post('/records', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      handleClose();
      fetchRecords(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Failed to create record.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await apiClient.delete(`/records/${id}`);
        fetchRecords();
      } catch (err) {
        console.error(err);
        alert("Failed to delete record.");
      }
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" className="gradient-text">
          Financial Records
        </Typography>
        
        {isAdmin && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpen}
            className="hover-lift"
          >
            Add Record
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} className="glass-panel animate-fade-in delay-100" elevation={0} sx={{ overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Type</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Amount</TableCell>
              {isAdmin && <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
             {records.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={isAdmin ? 6 : 5} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No records found. Start adding some!
                    </TableCell>
                </TableRow>
             ) : (
                records.map((record) => (
                <TableRow key={record.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background 0.2s' }}>
                    <TableCell sx={{ fontWeight: 500 }}>{record.date}</TableCell>
                    <TableCell>{record.description || <span style={{opacity: 0.5}}>-</span>}</TableCell>
                    <TableCell>
                      <Chip label={record.categoryName} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                    <Chip 
                        label={record.type} 
                        color={record.type === 'INCOME' ? 'success' : 'error'} 
                        size="small"
                        sx={{ fontWeight: 'bold', borderRadius: '8px' }}
                    />
                    </TableCell>
                    <TableCell align="right" sx={{ 
                        fontWeight: 800,
                        color: record.type === 'INCOME' ? 'success.main' : 'error.main' 
                    }}>
                    {record.type === 'INCOME' ? '+' : '-'}${record.amount.toFixed(2)}
                    </TableCell>
                    {isAdmin && (
                    <TableCell align="center">
                        <IconButton className="hover-scale" color="error" onClick={() => handleDelete(record.id)} size="small" sx={{ backgroundColor: 'rgba(244,63,94,0.1)' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                    )}
                </TableRow>
                ))
             )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ className: 'glass-panel' }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add Financial Record</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              <MenuItem value="INCOME">Income</MenuItem>
              <MenuItem value="EXPENSE">Expense</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Amount"
              name="amount"
              type="number"
              inputProps={{ min: "0.01", step: "0.01" }}
              fullWidth
              required
              value={formData.amount}
              onChange={handleChange}
            />
             <TextField
              select
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              {categories.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Date"
              name="date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={submitLoading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
               {submitLoading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Records;
