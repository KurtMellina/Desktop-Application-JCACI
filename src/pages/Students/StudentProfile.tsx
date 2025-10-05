import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Edit,
  School,
  CheckCircle,
  Grade,
  Payment,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

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
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  // Mock student data - in a real app, this would be fetched based on the ID
  const student = {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    grade: '5',
    section: 'A',
    status: 'Active',
    enrollmentDate: '2023-09-01',
    dateOfBirth: '2012-03-15',
    parentName: 'John & Jane Johnson',
    parentPhone: '+1 (555) 123-4568',
    parentEmail: 'parents.johnson@email.com',
    avatar: null,
  };

  const attendanceRecords = [
    { date: '2024-01-15', status: 'Present', subject: 'Math' },
    { date: '2024-01-14', status: 'Present', subject: 'Science' },
    { date: '2024-01-13', status: 'Absent', subject: 'English' },
    { date: '2024-01-12', status: 'Present', subject: 'History' },
    { date: '2024-01-11', status: 'Late', subject: 'Math' },
  ];

  const gradeRecords = [
    { subject: 'Mathematics', grade: 'A', percentage: 95, term: 'Fall 2023' },
    { subject: 'Science', grade: 'A-', percentage: 92, term: 'Fall 2023' },
    { subject: 'English', grade: 'B+', percentage: 88, term: 'Fall 2023' },
    { subject: 'History', grade: 'A', percentage: 94, term: 'Fall 2023' },
    { subject: 'Art', grade: 'A+', percentage: 98, term: 'Fall 2023' },
  ];

  const paymentRecords = [
    { date: '2024-01-01', amount: 500, status: 'Paid', description: 'Monthly Tuition' },
    { date: '2023-12-01', amount: 500, status: 'Paid', description: 'Monthly Tuition' },
    { date: '2023-11-01', amount: 500, status: 'Paid', description: 'Monthly Tuition' },
    { date: '2023-10-01', amount: 500, status: 'Overdue', description: 'Monthly Tuition' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      case 'Paid': return 'success';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'success';
    if (grade.includes('B')) return 'info';
    if (grade.includes('C')) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/students')}
        >
          ← Back to Students
        </Button>
        <Button
          variant="contained"
          startIcon={<Edit />}
        >
          Edit Student
        </Button>
      </Box>

      {/* Student Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 80, height: 80, fontSize: 32 }}>
                {student.firstName[0]}{student.lastName[0]}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {student.firstName} {student.lastName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={`Grade ${student.grade}`} color="primary" />
                <Chip label={`Section ${student.section}`} color="secondary" />
                <Chip 
                  label={student.status} 
                  color={student.status === 'Active' ? 'success' : 'warning'} 
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">{student.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">{student.phone}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">{student.address}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<School />} label="Details" />
            <Tab icon={<CheckCircle />} label="Attendance" />
            <Tab icon={<Grade />} label="Grades" />
            <Tab icon={<Payment />} label="Payments" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Date of Birth"
                    secondary={new Date(student.dateOfBirth).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Grade"
                    secondary={`Grade ${student.grade}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Section"
                    secondary={`Section ${student.section}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={student.status}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Parent/Guardian Information</Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Parent/Guardian Name"
                    secondary={student.parentName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Parent Phone"
                    secondary={student.parentPhone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Parent Email"
                    secondary={student.parentEmail}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Recent Attendance</Typography>
          <List>
            {attendanceRecords.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <CheckCircle color={getStatusColor(record.status) as any} />
                </ListItemIcon>
                <ListItemText
                  primary={`${record.subject} - ${new Date(record.date).toLocaleDateString()}`}
                  secondary={record.status}
                />
                <Chip
                  label={record.status}
                  size="small"
                  color={getStatusColor(record.status) as any}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Academic Performance</Typography>
          <List>
            {gradeRecords.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={record.subject}
                  secondary={`${record.term} - ${record.percentage}%`}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={record.grade}
                    size="small"
                    color={getGradeColor(record.grade) as any}
                  />
                  <Chip
                    label={`${record.percentage}%`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Payment History</Typography>
          <List>
            {paymentRecords.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={record.description}
                  secondary={new Date(record.date).toLocaleDateString()}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                    ${record.amount}
                  </Typography>
                  <Chip
                    label={record.status}
                    size="small"
                    color={getStatusColor(record.status) as any}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default StudentProfile;
