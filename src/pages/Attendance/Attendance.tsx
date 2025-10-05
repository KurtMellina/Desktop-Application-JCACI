import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Save,
  Print,
  FilterList,
  Refresh,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [attendanceData, setAttendanceData] = useState<Student[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in a real app, this would come from an API
  const students: Student[] = [
    { id: 1, name: 'Sarah Johnson', rollNumber: '001', status: 'Present' },
    { id: 2, name: 'Michael Wilson', rollNumber: '002', status: 'Present' },
    { id: 3, name: 'Emily Davis', rollNumber: '003', status: 'Absent' },
    { id: 4, name: 'James Brown', rollNumber: '004', status: 'Late' },
    { id: 5, name: 'Olivia Miller', rollNumber: '005', status: 'Present' },
    { id: 6, name: 'William Garcia', rollNumber: '006', status: 'Present' },
    { id: 7, name: 'Sophia Martinez', rollNumber: '007', status: 'Excused' },
    { id: 8, name: 'Alexander Anderson', rollNumber: '008', status: 'Present' },
  ];

  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D'];

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedSection('');
    // In a real app, this would fetch students for the selected grade
    setAttendanceData(students);
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    // In a real app, this would filter students by section
    setAttendanceData(students);
  };

  const handleStatusChange = (studentId: number, newStatus: Student['status']) => {
    setAttendanceData(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const handleSaveAttendance = () => {
    setSaveDialogOpen(true);
  };

  const confirmSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSaveDialogOpen(false);
      alert('Attendance saved successfully!');
    }, 1000);
  };

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      case 'Excused': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'Present': return <CheckCircle />;
      case 'Absent': return <Cancel />;
      case 'Late': return <Schedule />;
      case 'Excused': return <Schedule />;
      default: return <CheckCircle />;
    }
  };

  const getAttendanceStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(s => s.status === 'Present').length;
    const absent = attendanceData.filter(s => s.status === 'Absent').length;
    const late = attendanceData.filter(s => s.status === 'Late').length;
    const excused = attendanceData.filter(s => s.status === 'Excused').length;
    
    return { total, present, absent, late, excused };
  };

  const stats = getAttendanceStats();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Attendance</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              disabled={!selectedGrade || !selectedSection}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Select Class
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue || new Date())}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={selectedGrade}
                    onChange={(e) => handleGradeChange(e.target.value)}
                    label="Grade"
                  >
                    {grades.map(grade => (
                      <MenuItem key={grade} value={grade}>
                        Grade {grade}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={selectedSection}
                    onChange={(e) => handleSectionChange(e.target.value)}
                    label="Section"
                    disabled={!selectedGrade}
                  >
                    {sections.map(section => (
                      <MenuItem key={section} value={section}>
                        Section {section}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<FilterList />}
                  disabled={!selectedGrade || !selectedSection}
                >
                  Load Class
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Attendance Stats */}
        {selectedGrade && selectedSection && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2">Total Students</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {stats.present}
                  </Typography>
                  <Typography variant="body2">Present</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {stats.absent}
                  </Typography>
                  <Typography variant="body2">Absent</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {stats.late}
                  </Typography>
                  <Typography variant="body2">Late</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {stats.excused}
                  </Typography>
                  <Typography variant="body2">Excused</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2">Attendance %</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Attendance Table */}
        {selectedGrade && selectedSection && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Grade {selectedGrade} - Section {selectedSection}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveAttendance}
                  disabled={attendanceData.length === 0}
                >
                  Save Attendance
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Roll No.</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell align="center">Present</TableCell>
                      <TableCell align="center">Absent</TableCell>
                      <TableCell align="center">Late</TableCell>
                      <TableCell align="center">Excused</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={student.status === 'Present'}
                            onChange={() => handleStatusChange(student.id, 'Present')}
                            color="success"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={student.status === 'Absent'}
                            onChange={() => handleStatusChange(student.id, 'Absent')}
                            color="error"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={student.status === 'Late'}
                            onChange={() => handleStatusChange(student.id, 'Late')}
                            color="warning"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={student.status === 'Excused'}
                            onChange={() => handleStatusChange(student.id, 'Excused')}
                            color="info"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getStatusIcon(student.status)}
                            label={student.status}
                            color={getStatusColor(student.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Save Confirmation Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Save Attendance</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to save the attendance for Grade {selectedGrade} - Section {selectedSection} 
              on {selectedDate.toLocaleDateString()}?
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              This action cannot be undone. Please review the attendance data before saving.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmSave} 
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Attendance;
