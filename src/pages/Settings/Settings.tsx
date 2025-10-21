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
  Snackbar,
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
import { settingsService, usersService, User as UserType, UserInsert, UserUpdate } from '../../services/database';

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

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Teacher' as 'Admin' | 'Teacher' | 'Staff',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  // Load settings from database
  const loadSettings = async () => {
    try {
      const dbSettings = await settingsService.getAll();
      
      // Map database settings to component state
      const mappedSettings = {
        schoolName: dbSettings.school_name || 'Jolly Children Academic Center',
        schoolAddress: dbSettings.school_address || '123 Education Street, Learning City, LC 12345',
        schoolPhone: dbSettings.school_phone || '+1 (555) 123-4567',
        schoolEmail: dbSettings.school_email || 'info@jollychildren.edu',
        schoolWebsite: dbSettings.school_website || 'www.jollychildren.edu',
        academicYear: dbSettings.academic_year || '2024-2025',
        currency: dbSettings.currency || 'PHP',
        timezone: dbSettings.timezone || 'America/New_York',
        language: dbSettings.language || 'English',
        notifications: dbSettings.notifications || { email: true, sms: false, push: true },
        backup: dbSettings.backup || { autoBackup: true, backupFrequency: 'Daily', cloudStorage: true },
      };
      
      setSettings(mappedSettings);
    } catch (error: any) {
      console.error('Error loading settings:', error);
      // Keep default settings if database fails
    }
  };

  // Load users from database
  const loadUsers = async () => {
    try {
      const usersData = await usersService.getAll();
      setUsers(usersData);
    } catch (error: any) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    }
  };

  useEffect(() => {
    loadSettings();
    loadUsers();
  }, []);

  const handleSaveSettings = async () => {
    try {
      // Save settings to database
      await settingsService.set('school_name', settings.schoolName);
      await settingsService.set('school_address', settings.schoolAddress);
      await settingsService.set('school_phone', settings.schoolPhone);
      await settingsService.set('school_email', settings.schoolEmail);
      await settingsService.set('school_website', settings.schoolWebsite);
      await settingsService.set('academic_year', settings.academicYear);
      await settingsService.set('currency', settings.currency);
      await settingsService.set('timezone', settings.timezone);
      await settingsService.set('language', settings.language);
      await settingsService.set('notifications', settings.notifications);
      await settingsService.set('backup', settings.backup);
      
      setSuccess(true);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to save settings');
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setUserForm({
      name: '',
      email: '',
      role: 'Teacher',
      password: '',
    });
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
    setUserDialogOpen(true);
  };

  const handleDeleteUser = async (user: UserType) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await usersService.delete(user.id);
        await loadUsers(); // Refresh the list
        setSuccess(true);
        setError(null);
      } catch (error: any) {
        setError(error.message || 'Failed to delete user');
      }
    }
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser) {
        // Update existing user
        const updateData: UserUpdate = {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
        };
        await usersService.update(selectedUser.id, updateData);
      } else {
        // Create new user - validate required fields
        if (!userForm.password) {
          setError('Password is required for new users');
          return;
        }
        
        const newUser: UserInsert = {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          password: userForm.password,
        };
        await usersService.create(newUser);
      }
      
      await loadUsers(); // Refresh the list
      setUserDialogOpen(false);
      setSuccess(true);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to save user');
    }
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
                  <MenuItem value="PHP">PHP (₱)</MenuItem>
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
                    secondary={`${user.email} • ${user.role}`}
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
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as 'Admin' | 'Teacher' | 'Staff' }))}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Teacher">Teacher</MenuItem>
                  <MenuItem value="Staff">Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter new password"
                helperText={selectedUser ? "Leave blank to keep current password" : "Password is required for new users"}
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

      {/* Error Notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Success Notification */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
