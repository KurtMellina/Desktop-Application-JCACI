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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Grade,
  Add,
  Edit,
  Save,
  Print,
  FilterList,
  Assignment,
} from '@mui/icons-material';

interface GradeRecord {
  id: number;
  studentId: number;
  studentName: string;
  subject: string;
  assignment: string;
  grade: string;
  percentage: number;
  date: string;
  term: string;
}

const Grading: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeRecord | null>(null);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
  const terms = ['Fall 2023', 'Spring 2024', 'Summer 2024'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  // Mock data - in a real app, this would come from an API
  const gradeRecords: GradeRecord[] = [
    {
      id: 1,
      studentId: 1,
      studentName: 'Sarah Johnson',
      subject: 'Mathematics',
      assignment: 'Algebra Test',
      grade: 'A',
      percentage: 95,
      date: '2024-01-15',
      term: 'Fall 2023',
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Michael Wilson',
      subject: 'Science',
      assignment: 'Chemistry Lab',
      grade: 'B+',
      percentage: 88,
      date: '2024-01-14',
      term: 'Fall 2023',
    },
    {
      id: 3,
      studentId: 3,
      studentName: 'Emily Davis',
      subject: 'English',
      assignment: 'Essay Writing',
      grade: 'A-',
      percentage: 92,
      date: '2024-01-13',
      term: 'Fall 2023',
    },
  ];

  const filteredGrades = gradeRecords.filter(record => {
    const matchesSubject = !selectedSubject || record.subject === selectedSubject;
    const matchesTerm = !selectedTerm || record.term === selectedTerm;
    return matchesSubject && matchesTerm;
  });

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'success';
    if (grade.includes('B')) return 'info';
    if (grade.includes('C')) return 'warning';
    return 'error';
  };

  const handleAddGrade = () => {
    setEditingGrade(null);
    setGradeDialogOpen(true);
  };

  const handleEditGrade = (grade: GradeRecord) => {
    setEditingGrade(grade);
    setGradeDialogOpen(true);
  };

  const handleSaveGrade = () => {
    // In a real app, this would save to an API
    console.log('Saving grade:', editingGrade);
    setGradeDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Grading</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Print />}
            disabled={!selectedSubject || !selectedTerm}
          >
            Print Grades
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddGrade}
          >
            Add Grade
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filter Grades
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  label="Subject"
                >
                  {subjects.map(subject => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Term</InputLabel>
                <Select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  label="Term"
                >
                  {terms.map(term => (
                    <MenuItem key={term} value={term}>
                      {term}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Grade Level</InputLabel>
                <Select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  label="Grade Level"
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
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FilterList />}
                onClick={() => {
                  setSelectedSubject('');
                  setSelectedTerm('');
                  setSelectedGrade('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Grade Statistics */}
      {filteredGrades.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {filteredGrades.length}
                </Typography>
                <Typography variant="body2">Total Grades</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {Math.round(filteredGrades.reduce((sum, grade) => sum + grade.percentage, 0) / filteredGrades.length)}
                </Typography>
                <Typography variant="body2">Average %</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {filteredGrades.filter(g => g.grade.includes('A')).length}
                </Typography>
                <Typography variant="body2">A Grades</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {filteredGrades.filter(g => g.grade.includes('C') || g.grade.includes('D') || g.grade.includes('F')).length}
                </Typography>
                <Typography variant="body2">Below B</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Grades Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Grade Records
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Assignment</TableCell>
                  <TableCell align="center">Grade</TableCell>
                  <TableCell align="center">Percentage</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Term</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGrades.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.studentName}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>{record.assignment}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={record.grade}
                        color={getGradeColor(record.grade)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{record.percentage}%</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.term}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Grade">
                        <IconButton
                          size="small"
                          onClick={() => handleEditGrade(record)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Grade Dialog */}
      <Dialog open={gradeDialogOpen} onClose={() => setGradeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGrade ? 'Edit Grade' : 'Add New Grade'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select label="Student">
                  <MenuItem value="sarah">Sarah Johnson</MenuItem>
                  <MenuItem value="michael">Michael Wilson</MenuItem>
                  <MenuItem value="emily">Emily Davis</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select label="Subject">
                  {subjects.map(subject => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assignment/Test Name"
                defaultValue={editingGrade?.assignment || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grade (A, B+, B, etc.)"
                defaultValue={editingGrade?.grade || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percentage"
                type="number"
                defaultValue={editingGrade?.percentage || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                defaultValue={editingGrade?.date || ''}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Term</InputLabel>
                <Select label="Term">
                  {terms.map(term => (
                    <MenuItem key={term} value={term}>
                      {term}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveGrade}
          >
            {editingGrade ? 'Update' : 'Add'} Grade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Grading;
