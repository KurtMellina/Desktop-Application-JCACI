import React, { useState } from 'react';
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
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  School,
  Security,
  Notifications,
  Backup,
  Person,
  Email,
  Phone,
  Save,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    schoolName: 'Jolly Children Academic Center',
    schoolAddress: '123 Education Street, Learning City, LC 12345',
    schoolPhone: '+1 (555) 123-4567',
    schoolEmail: 'info@jollychildren.edu',
    schoolWebsite: 'www.jollychildren.edu',
    academicYear: '2024-2025',
    currency: 'USD',
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

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Mock users data
  const users = [
    { id: 1, name: 'John Smith', email: 'john.smith@jollychildren.edu', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@jollychildren.edu', role: 'Teacher', status: 'Active' },
    { id: 3, name: 'Michael Brown', email: 'michael.brown@jollychildren.edu', role: 'Registrar', status: 'Active' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNestedSettingChange = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as Record<string, any>),
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to an API
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log('Delete user:', user);
    }
  };

  const handleSaveUser = () => {
    console.log('Save user:', selectedUser);
    setUserDialogOpen(false);
  };

  const getTabContent = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: // General Settings
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                School Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School Name"
                value={settings.schoolName}
                onChange={(e) => handleSettingChange('schoolName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Academic Year"
                value={settings.academicYear}
                onChange={(e) => handleSettingChange('academicYear', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Address"
                multiline
                rows={2}
                value={settings.schoolAddress}
                onChange={(e) => handleSettingChange('schoolAddress', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Phone"
                value={settings.schoolPhone}
                onChange={(e) => handleSettingChange('schoolPhone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={settings.schoolEmail}
                onChange={(e) => handleSettingChange('schoolEmail', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Website"
                value={settings.schoolWebsite}
                onChange={(e) => handleSettingChange('schoolWebsite', e.target.value)}
              />
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                System Preferences
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  label="Currency"
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  label="Language"
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1: // Notifications
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(e) => handleNestedSettingChange('notifications', 'email', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.sms}
                    onChange={(e) => handleNestedSettingChange('notifications', 'sms', e.target.checked)}
                  />
                }
                label="SMS Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.push}
                    onChange={(e) => handleNestedSettingChange('notifications', 'push', e.target.checked)}
                  />
                }
                label="Push Notifications"
              />
            </Grid>
          </Grid>
        );

      case 2: // Backup
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Backup Settings
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.backup.autoBackup}
                    onChange={(e) => handleNestedSettingChange('backup', 'autoBackup', e.target.checked)}
                  />
                }
                label="Automatic Backup"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Backup Frequency</InputLabel>
                <Select
                  value={settings.backup.backupFrequency}
                  onChange={(e) => handleNestedSettingChange('backup', 'backupFrequency', e.target.value)}
                  label="Backup Frequency"
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.backup.cloudStorage}
                    onChange={(e) => handleNestedSettingChange('backup', 'cloudStorage', e.target.checked)}
                  />
                }
                label="Cloud Storage Backup"
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Last backup: January 15, 2024 at 2:30 AM
              </Alert>
            </Grid>
          </Grid>
        );

      case 3: // Users
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">User Management</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddUser}
              >
                Add User
              </Button>
            </Box>
            <List>
              {users.map((user) => (
                <ListItem key={user.id} divider>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.name}
                    secondary={`${user.email} • ${user.role} • ${user.status}`}
                  />
                  <IconButton onClick={() => handleEditUser(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user)} color="error">
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your school's settings and preferences.
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab icon={<School />} label="General" />
            <Tab icon={<Notifications />} label="Notifications" />
            <Tab icon={<Backup />} label="Backup" />
            <Tab icon={<Person />} label="Users" />
          </Tabs>
        </Box>

        {getTabContent(activeTab)}

        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            size="large"
          >
            Save Settings
          </Button>
        </Box>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                defaultValue={selectedUser?.name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue={selectedUser?.email || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  defaultValue={selectedUser?.role || 'Teacher'}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Teacher">Teacher</MenuItem>
                  <MenuItem value="Registrar">Registrar</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Receptionist">Receptionist</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedUser?.status || 'Active'}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                placeholder="Enter new password"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Person />}
            onClick={handleSaveUser}
          >
            {selectedUser ? 'Update' : 'Add'} User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
