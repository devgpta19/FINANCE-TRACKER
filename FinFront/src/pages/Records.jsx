import React, { useEffect, useState, useContext, useCallback } from 'react';
import { 
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, CircularProgress, IconButton, Alert, Stack
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, FilterList as FilterIcon, RestartAlt as ResetIcon } from '@mui/icons-material';
import apiClient from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter State
  const [filters, setFilters] = useState({
    type: '',
    categoryId: '',
    startDate: '',
    endDate: ''
  });

  // Dialog State
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '', type: 'EXPENSE', categoryId: '', date: new Date().toISOString().split('T')[0], description: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const { currency } = useContext(CurrencyContext);
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `/records?${queryString}` : '/records';
      
      const response = await apiClient.get(url);
      setRecords(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch records. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
      if(response.data.length > 0 && !formData.categoryId) {
        setFormData(prev => ({...prev, categoryId: response.data[0].id}));
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ type: '', categoryId: '', startDate: '', endDate: '' });
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
      fetchRecords(); 
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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

      {/* Filter Bar */}
      <Paper className="glass-panel animate-fade-in" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <FilterIcon color="action" />
          <TextField
            select
            label="Type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="INCOME">Income</MenuItem>
            <MenuItem value="EXPENSE">Expense</MenuItem>
          </TextField>

          <TextField
            select
            label="Category"
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="From"
            name="startDate"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={handleFilterChange}
          />

          <TextField
            label="To"
            name="endDate"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={handleFilterChange}
          />

          <Button 
            startIcon={<ResetIcon />} 
            onClick={resetFilters}
            variant="outlined"
            size="medium"
            color="inherit"
            sx={{ ml: 'auto !important' }}
          >
            Reset
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading && records.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
      ) : (
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
            <TableBody sx={{ position: 'relative' }}>
              {loading && (
                <Box sx={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  backgroundColor: 'rgba(255,255,255,0.4)', zIndex: 1,
                  display: 'flex', justifyContent: 'center', alignItems: 'center' 
                }}>
                  <CircularProgress size={30} />
                </Box>
              )}
              {records.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={isAdmin ? 6 : 5} align="center" sx={{ py: 10, color: 'text.secondary' }}>
                        No records found matching these filters.
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
                      {record.type === 'INCOME' ? '+' : '-'}{currency}{record.amount.toFixed(2)}
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
      )}

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
              required
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
