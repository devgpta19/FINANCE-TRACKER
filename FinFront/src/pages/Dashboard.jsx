import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { AccountBalanceWallet, TrendingUp, TrendingDown } from '@mui/icons-material';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import apiClient from '../api/apiClient';
import { ThemeContext } from '../context/ThemeContext';

// Register ChartJS plugins
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, catRes, trendRes] = await Promise.all([
          apiClient.get('/dashboard/summary'),
          apiClient.get('/dashboard/category-summary'),
          apiClient.get('/dashboard/monthly-trends')
        ]);
        
        setSummary(sumRes.data);
        setCategories(catRes.data);
        setTrends(trendRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" className="glass-panel" sx={{ mt: 2 }}>{error}</Alert>;
  }

  // Common chart options to adapt to themes
  const textColor = mode === 'dark' ? '#fafafa' : '#0f172a';
  const gridColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  // Premium Vibrant Palettes
  const pieColors = [
    mode === 'dark' ? '#818cf8' : '#4f46e5', // Indigo
    mode === 'dark' ? '#38bdf8' : '#0ea5e9', // Sky Blue
    mode === 'dark' ? '#34d399' : '#10b981', // Emerald
    mode === 'dark' ? '#fbbf24' : '#f59e0b', // Amber
    mode === 'dark' ? '#fb7185' : '#f43f5e', // Rose
    mode === 'dark' ? '#a78bfa' : '#8b5cf6', // Violet
  ];

  // Pie Chart Data
  const pieData = {
    labels: categories.map(c => c.category),
    datasets: [
      {
        data: categories.map(c => c.total),
        backgroundColor: pieColors,
        borderColor: mode === 'dark' ? '#18181b' : '#ffffff',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { position: 'right', labels: { color: textColor, font: { family: 'Outfit', size: 13 } } },
      tooltip: { backgroundColor: mode === 'dark' ? 'rgba(24,24,27,0.9)' : 'rgba(255,255,255,0.9)', titleColor: textColor, bodyColor: textColor, borderColor: gridColor, borderWidth: 1 }
    },
    cutout: '65%', // makes it a beautiful donut
  };

  // Bar Chart Data
  const barData = {
    labels: trends.map(t => t.month),
    datasets: [
      {
        label: 'Income',
        data: trends.map(t => t.income),
        backgroundColor: mode === 'dark' ? '#34d399' : '#10b981',
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: 'Expense',
        data: trends.map(t => t.expense),
        backgroundColor: mode === 'dark' ? '#fb7185' : '#f43f5e',
        borderRadius: 6,
        barPercentage: 0.6,
      }
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: textColor, font: { family: 'Outfit' } } },
      tooltip: { backgroundColor: mode === 'dark' ? 'rgba(24,24,27,0.9)' : 'rgba(255,255,255,0.9)', titleColor: textColor, bodyColor: textColor, borderColor: gridColor, borderWidth: 1 }
    },
    scales: {
      y: { ticks: { color: textColor, font: { family: 'Outfit' } }, grid: { color: gridColor }, border: { display: false } },
      x: { ticks: { color: textColor, font: { family: 'Outfit' } }, grid: { display: false }, border: { display: false } }
    }
  };

  const SummaryCard = ({ title, value, icon, gradient, color, delayClass }) => (
    <Card className={`hover-lift glass-panel ${delayClass || ''}`} elevation={0} sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle top border gradient accent */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: gradient || color }} />
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>{title}</Typography>
          <Box className="hover-scale" sx={{ p: 1.5, borderRadius: '14px', backgroundColor: `${color}15`, color: color, display: 'flex' }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-1px' }}>
          ${value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" fontWeight={800} className="gradient-text">Dashboard Overview</Typography>
      </Box>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <SummaryCard 
            title="Total Income" 
            value={summary?.totalIncome} 
            icon={<TrendingUp />} 
            color={mode === 'dark' ? '#34d399' : '#10b981'}
            delayClass="animate-fade-in delay-100"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard 
            title="Total Expense" 
            value={summary?.totalExpense} 
            icon={<TrendingDown />} 
            color={mode === 'dark' ? '#fb7185' : '#f43f5e'}
            delayClass="animate-fade-in delay-200"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard 
            title="Net Balance" 
            value={summary?.netBalance} 
            icon={<AccountBalanceWallet />} 
            color={mode === 'dark' ? '#818cf8' : '#4f46e5'}
            gradient="linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)"
            delayClass="animate-fade-in delay-300"
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card className="glass-panel hover-lift animate-fade-in delay-100" elevation={0}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Monthly Cash Flow</Typography>
              <Box sx={{ height: 350, position: 'relative' }}>
                {trends.length > 0 ? <Bar data={barData} options={barOptions} /> : <Box sx={{ height: '100%', display: 'flex', alignItems:'center', justifyContent:'center'}}><Typography color="text.secondary">No data available</Typography></Box>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="glass-panel hover-lift animate-fade-in delay-200" elevation={0} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Expense Distribution</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, position: 'relative' }}>
                {categories.length > 0 ? <Pie data={pieData} options={pieOptions} /> : <Typography color="text.secondary">No data available</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
