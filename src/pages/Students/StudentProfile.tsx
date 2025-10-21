import React, { useEffect, useMemo, useState } from 'react';
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
import { studentsService, Student } from '../../services/database';

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

// Transform the database student to match component interface
interface StudentDisplay extends Student {
  firstName: string;
  lastName: string;
  enrollmentDate: string;
}

const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [student, setStudent] = useState<StudentDisplay | null>(null);
  const [studentGrades, setStudentGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const studentData = await studentsService.getById(Number(id));
        
        if (studentData) {
          // Transform data to match component interface
          const transformedStudent: StudentDisplay = {
            ...studentData,
            firstName: studentData.first_name,
            lastName: studentData.last_name,
            enrollmentDate: studentData.enrollment_date,
          };
          setStudent(transformedStudent);
        } else {
          setStudent(null);
        }
      } catch (error: any) {
        setError(error.message || 'Failed to load student');
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  useEffect(() => {
    const loadStudentGrades = async () => {
      if (!id) return;
      
      try {
        // For now, we'll use empty array since grades service needs to be enhanced
        // TODO: Implement getByStudent in gradesService and load real data
        setStudentGrades([]);
      } catch (error) {
        console.error('Error loading student grades:', error);
        setStudentGrades([]);
      }
    };

    loadStudentGrades();
  }, [id]);

  const initials = useMemo(() => {
    if (!student) return '??';
    const f = student.firstName?.[0] || '?';
    const l = student.lastName?.[0] || '?';
    return `${f}${l}`;
  }, [student]);

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

  if (loading) {
    return (
      <Box>
        <Button variant="outlined" onClick={() => navigate('/students')}>
          ← Back to Students
        </Button>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading student information...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button variant="outlined" onClick={() => navigate('/students')}>
          ← Back to Students
        </Button>
        <Typography variant="h6" sx={{ mt: 2 }} color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box>
        <Button variant="outlined" onClick={() => navigate('/students')}>
          ← Back to Students
        </Button>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Student not found.
        </Typography>
      </Box>
    );
  }

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
                {initials}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {student.firstName} {student.lastName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={`Grade ${student.grade || '-'}`} color="primary" />
                <Chip label={`Section ${student.section || '-'}`} color="secondary" />
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
                </Grid>
                <Grid item xs={12} sm={6}>
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
                    primary="Grade"
                    secondary={`Grade ${student.grade || '-'}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Section"
                    secondary={`Section ${student.section || '-'}`}
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
            {studentGrades.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`${record.subject} • ${record.assignment || '—'}`}
                  secondary={`${record.term || '—'} - ${record.percentage}%`}
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
            {studentGrades.length === 0 && (
              <Typography variant="body2" color="text.secondary">No grades yet.</Typography>
            )}
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
