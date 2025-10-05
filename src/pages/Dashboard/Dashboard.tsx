import React from 'react';
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from an API
  const stats = [
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
      value: '$12,450',
      change: '-5%',
      icon: <Payment />,
      color: 'warning',
    },
  ];

  const recentActivities = [
    { id: 1, action: 'New student enrolled', student: 'Sarah Johnson', time: '2 hours ago', type: 'enrollment' },
    { id: 2, action: 'Attendance marked', student: 'Grade 3A', time: '3 hours ago', type: 'attendance' },
    { id: 3, action: 'Payment received', student: 'Mike Wilson', time: '4 hours ago', type: 'payment' },
    { id: 4, action: 'Grade submitted', student: 'Math - Grade 5', time: '5 hours ago', type: 'grading' },
  ];

  const upcomingEvents = [
    { title: 'Parent-Teacher Meeting', date: 'Tomorrow, 2:00 PM', type: 'meeting' },
    { title: 'Monthly Report Due', date: 'Friday, 5:00 PM', type: 'deadline' },
    { title: 'School Assembly', date: 'Next Monday, 9:00 AM', type: 'event' },
  ];

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
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's what's happening at Jolly Children Academic Center.
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
