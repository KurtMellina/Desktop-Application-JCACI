import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  People,
  School,
  CheckCircle,
  Payment,
  TrendingUp,
  Assignment,
  Notifications,
  Schedule,
  Settings,
  Email,
  Phone,
  Language,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Admin settings state
  const [adminSettings, setAdminSettings] = useState({
    schoolName: 'Jolly Children Academic Center',
    schoolAddress: '123 Education Street, Learning City, LC 12345',
    schoolPhone: '+1 (555) 123-4567',
    schoolEmail: 'info@jollychildren.edu',
    schoolWebsite: 'www.jollychildren.edu',
    academicYear: '2024-2025',
    currency: 'PHP',
    timezone: 'America/New_York',
    language: 'English',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'Daily',
      cloudStorage: true,
    },
  });

  const [stats, setStats] = useState([
    {
      title: 'Total Students',
      value: '1,247',
      change: '+12%',
      icon: <People />,
      color: 'primary',
    },
    {
      title: 'Active Classes',
      value: '24',
      change: '+2',
      icon: <School />,
      color: 'secondary',
    },
    {
      title: 'Today\'s Attendance',
      value: '94%',
      change: '+3%',
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      title: 'Outstanding Invoices',
      value: '₱12,450',
      change: '-5%',
      icon: <Payment />,
      color: 'warning',
    },
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'New student enrolled', student: 'Sarah Johnson', time: '2 hours ago', type: 'enrollment' },
    { id: 2, action: 'Attendance marked', student: 'Grade 3A', time: '3 hours ago', type: 'attendance' },
    { id: 3, action: 'Payment received', student: 'Mike Wilson', time: '4 hours ago', type: 'payment' },
    { id: 4, action: 'Grade submitted', student: 'Math - Grade 5', time: '5 hours ago', type: 'grading' },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { title: 'Parent-Teacher Meeting', date: 'Tomorrow, 2:00 PM', type: 'meeting' },
    { title: 'Monthly Report Due', date: 'Friday, 5:00 PM', type: 'deadline' },
    { title: 'School Assembly', date: 'Next Monday, 9:00 AM', type: 'event' },
  ]);

  useEffect(() => {
    try {
      // Load admin settings
      const settingsData = localStorage.getItem('appSettings');
      if (settingsData) {
        const parsedSettings = JSON.parse(settingsData);
        setAdminSettings(prev => ({ ...prev, ...parsedSettings }));
      }
      
      // Load dashboard data
      const s = localStorage.getItem('dashboard:stats');
      const a = localStorage.getItem('dashboard:activities');
      const e = localStorage.getItem('dashboard:events');
      if (s) setStats(JSON.parse(s));
      if (a) setRecentActivities(JSON.parse(a));
      if (e) setUpcomingEvents(JSON.parse(e));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('dashboard:stats', JSON.stringify(stats)); } catch {}
  }, [stats]);
  useEffect(() => {
    try { localStorage.setItem('dashboard:activities', JSON.stringify(recentActivities)); } catch {}
  }, [recentActivities]);
  useEffect(() => {
    try { localStorage.setItem('dashboard:events', JSON.stringify(upcomingEvents)); } catch {}
  }, [upcomingEvents]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <School />;
      case 'attendance': return <CheckCircle />;
      case 'payment': return <Payment />;
      case 'grading': return <Assignment />;
      default: return <Notifications />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'primary';
      case 'deadline': return 'warning';
      case 'event': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* School Information Header */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {adminSettings.schoolName}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                Academic Year: {adminSettings.academicYear}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{adminSettings.schoolEmail}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{adminSettings.schoolPhone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Language sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{adminSettings.language}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{adminSettings.currency}</Typography>
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Settings />}
              onClick={() => navigate('/settings')}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                color: 'white'
              }}
            >
              Manage Settings
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's what's happening at {adminSettings.schoolName}.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}.main`, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={stat.change}
                  size="small"
                  color={stat.change.startsWith('+') ? 'success' : 'error'}
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Admin Settings Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Settings sx={{ mr: 1 }} />
            <Typography variant="h6">System Configuration</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {adminSettings.language}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  System Language
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {adminSettings.currency}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currency
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {adminSettings.backup.backupFrequency}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Backup Frequency
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {adminSettings.notifications.email ? 'Enabled' : 'Disabled'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email Notifications
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>School Address:</strong> {adminSettings.schoolAddress}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Website:</strong> {adminSettings.schoolWebsite}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Timezone:</strong> {adminSettings.timezone}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Activities</Typography>
              </Box>
              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.student} • ${activity.time}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/reports')}
              >
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1 }} />
                <Typography variant="h6">Upcoming Events</Typography>
              </Box>
              <List>
                {upcomingEvents.map((event, index) => (
                  <ListItem key={index} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getEventColor(event.type)}.light` }}>
                        <Schedule />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={event.title}
                      secondary={event.date}
                    />
                    <Chip
                      label={event.type}
                      size="small"
                      color={getEventColor(event.type) as any}
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/communications')}
              >
                Manage Events
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/students')}>
              <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1">Add Student</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/attendance')}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="subtitle1">Mark Attendance</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/billing')}>
              <Payment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="subtitle1">Create Invoice</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/reports')}>
              <Assignment sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="subtitle1">Generate Report</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
