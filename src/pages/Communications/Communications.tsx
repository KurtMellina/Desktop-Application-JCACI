import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Send,
  Announcement,
  Email,
  Message,
  Schedule,
  Person,
  Group,
  School,
} from '@mui/icons-material';

interface Communication {
  id: number;
  type: 'Announcement' | 'Email' | 'SMS' | 'Notice';
  title: string;
  content: string;
  recipients: string[];
  sender: string;
  date: string;
  status: 'Sent' | 'Scheduled' | 'Draft';
  priority: 'Low' | 'Medium' | 'High';
}

const Communications: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('Announcement');
  const [messages, setMessages] = useState<Communication[]>([]);

  // Default seed used on first run only
  const defaultCommunicationsSeed: Communication[] = [
    {
      id: 1,
      type: 'Announcement',
      title: 'School Holiday Notice',
      content: 'School will be closed on Monday, January 15th for Martin Luther King Jr. Day.',
      recipients: ['All Parents', 'All Students'],
      sender: 'Principal John Smith',
      date: '2024-01-10',
      status: 'Sent',
      priority: 'High',
    },
    {
      id: 2,
      type: 'Email',
      title: 'Parent-Teacher Meeting Reminder',
      content: 'Reminder: Parent-Teacher meetings are scheduled for next week. Please check your assigned time slot.',
      recipients: ['Grade 5 Parents'],
      sender: 'Sarah Johnson',
      date: '2024-01-12',
      status: 'Sent',
      priority: 'Medium',
    },
    {
      id: 3,
      type: 'Notice',
      title: 'Library Book Return',
      content: 'All library books must be returned by the end of this month.',
      recipients: ['All Students'],
      sender: 'Library Staff',
      date: '2024-01-14',
      status: 'Scheduled',
      priority: 'Low',
    },
  ];

  useEffect(() => {
    try {
      const raw = localStorage.getItem('communications');
      if (raw) {
        setMessages(JSON.parse(raw) as Communication[]);
      } else {
        setMessages(defaultCommunicationsSeed);
      }
    } catch {
      setMessages(defaultCommunicationsSeed);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('communications', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Announcement': return <Announcement />;
      case 'Email': return <Email />;
      case 'SMS': return <Message />;
      case 'Notice': return <School />;
      default: return <Message />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'success';
      case 'Scheduled': return 'warning';
      case 'Draft': return 'default';
      default: return 'default';
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCompose = () => {
    setComposeDialogOpen(true);
  };

  const handleSend = () => {
    // In a real app, this would send the communication
    console.log('Sending communication...');
    setComposeDialogOpen(false);
  };

  const getTabContent = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: // All Communications
        return (
          <List>
            {messages.map((comm) => (
              <React.Fragment key={comm.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getTypeIcon(comm.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">{comm.title}</Typography>
                        <Chip
                          label={comm.priority}
                          size="small"
                          color={getPriorityColor(comm.priority)}
                        />
                        <Chip
                          label={comm.status}
                          size="small"
                          color={getStatusColor(comm.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {comm.content}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography variant="caption">
                            From: {comm.sender}
                          </Typography>
                          <Typography variant="caption">
                            To: {comm.recipients.join(', ')}
                          </Typography>
                          <Typography variant="caption">
                            Date: {new Date(comm.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        );

      case 1: // Announcements
        return (
          <List>
            {messages.filter(c => c.type === 'Announcement').map((comm) => (
              <React.Fragment key={comm.id}>
                <ListItem>
                  <ListItemIcon>
                    <Announcement color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={comm.title}
                    secondary={comm.content}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        );

      case 2: // Emails
        return (
          <List>
            {messages.filter(c => c.type === 'Email').map((comm) => (
              <React.Fragment key={comm.id}>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={comm.title}
                    secondary={comm.content}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        );

      case 3: // Templates
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Communication Templates
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Holiday Notice
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Template for school holiday announcements
                    </Typography>
                    <Button size="small" variant="outlined">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Parent Meeting
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Template for parent-teacher meeting invitations
                    </Typography>
                    <Button size="small" variant="outlined">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Event Reminder
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Template for event reminders
                    </Typography>
                    <Button size="small" variant="outlined">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Communications</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCompose}
        >
          Compose Message
        </Button>
      </Box>

      {/* Communication Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {messages.length}
              </Typography>
              <Typography variant="body2">Total Messages</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {messages.filter(c => c.status === 'Sent').length}
              </Typography>
              <Typography variant="body2">Sent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {messages.filter(c => c.status === 'Scheduled').length}
              </Typography>
              <Typography variant="body2">Scheduled</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {messages.filter(c => c.priority === 'High').length}
              </Typography>
              <Typography variant="body2">High Priority</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="All Communications" />
            <Tab label="Announcements" />
            <Tab label="Emails" />
            <Tab label="Templates" />
          </Tabs>
        </Box>
        <CardContent>
          {getTabContent(activeTab)}
        </CardContent>
      </Card>

      {/* Compose Message Dialog */}
      <Dialog open={composeDialogOpen} onClose={() => setComposeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Compose Message</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Message Type</InputLabel>
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  label="Message Type"
                >
                  <MenuItem value="Announcement">Announcement</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="SMS">SMS</MenuItem>
                  <MenuItem value="Notice">Notice</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select label="Priority" defaultValue="Medium">
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject/Title"
                placeholder="Enter message subject or title"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Recipients</InputLabel>
                <Select
                  multiple
                  label="Recipients"
                  defaultValue={['All Parents']}
                >
                  <MenuItem value="All Parents">All Parents</MenuItem>
                  <MenuItem value="All Students">All Students</MenuItem>
                  <MenuItem value="All Staff">All Staff</MenuItem>
                  <MenuItem value="Grade 5 Parents">Grade 5 Parents</MenuItem>
                  <MenuItem value="Grade 6 Parents">Grade 6 Parents</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message Content"
                multiline
                rows={6}
                placeholder="Type your message here..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Schedule Date (Optional)"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" defaultValue="Draft">
                  <MenuItem value="Draft">Save as Draft</MenuItem>
                  <MenuItem value="Send Now">Send Now</MenuItem>
                  <MenuItem value="Schedule">Schedule</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeDialogOpen(false)}>Cancel</Button>
          <Button variant="outlined">Save Draft</Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSend}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Communications;
