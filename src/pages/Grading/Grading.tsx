import React, { useEffect, useState } from 'react';
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
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Grade,
  Add,
  Edit,
  Save,
  Print,
  FilterList,
  Assignment,
  Delete,
} from '@mui/icons-material';
import { studentsService, gradesService, Grade as GradeRecord, GradeInsert, GradeUpdate } from '../../services/database';

// Transform the database grade to match component interface
interface GradeDisplay extends Omit<GradeRecord, 'grade'> {
  studentName: string;
  assignment: string;
  grade: string; // Letter grade (A, B, C, D)
  percentage: number; // Numeric grade
  date: string;
  term: string;
}

const Grading: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeDisplay | null>(null);
  const [records, setRecords] = useState<GradeDisplay[]>([]);
  const [students, setStudents] = useState<{ id: number; firstName: string; lastName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Controlled form state for dialog
  const [formStudentId, setFormStudentId] = useState<number | ''>('');
  const [formSubject, setFormSubject] = useState('');
  const [formAssignment, setFormAssignment] = useState('');
  const [formGrade, setFormGrade] = useState('');
  const [formPercentage, setFormPercentage] = useState<number | ''>('');
  const [formDate, setFormDate] = useState('');
  const [formTerm, setFormTerm] = useState('');

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
  const terms = ['Fall 2023', 'Spring 2024', 'Summer 2024'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  // Load grades and students from database
  const loadGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all grades
      const allGrades = await gradesService.getAll();
      const allStudents = await studentsService.getAll();
      
      // Transform grades to match component interface
      const transformedGrades: GradeDisplay[] = allGrades.map(grade => {
        const student = allStudents.find(s => s.id === grade.student_id);
        return {
          ...grade,
          studentName: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
          assignment: grade.notes || 'Assignment',
          grade: grade.grade >= 90 ? 'A' : grade.grade >= 80 ? 'B' : grade.grade >= 70 ? 'C' : 'D',
          percentage: grade.grade,
          date: grade.created_at.split('T')[0],
          term: grade.academic_year,
        };
      });
      
      setRecords(transformedGrades);
      
      // Set students for selection
      setStudents(allStudents.map(s => ({ 
        id: s.id, 
        firstName: s.first_name, 
        lastName: s.last_name 
      })));
      
    } catch (error: any) {
      setError(error.message || 'Failed to load grades');
      console.error('Error loading grades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

  const filteredGrades = records.filter(record => {
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
    setFormStudentId('');
    setFormSubject(selectedSubject || '');
    setFormAssignment('');
    setFormGrade('');
    setFormPercentage('');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormTerm(selectedTerm || '');
    setGradeDialogOpen(true);
  };

  const handleEditGrade = (grade: GradeDisplay) => {
    setEditingGrade(grade);
    setFormStudentId(grade.student_id);
    setFormSubject(grade.subject);
    setFormAssignment(grade.assignment);
    setFormGrade(grade.grade);
    setFormPercentage(grade.percentage);
    setFormDate(grade.date);
    setFormTerm(grade.term);
    setGradeDialogOpen(true);
  };

  const handleDeleteGrade = async (grade: GradeDisplay) => {
    if (window.confirm(`Are you sure you want to delete this grade record?`)) {
      try {
        await gradesService.delete(grade.id);
        await loadGrades(); // Refresh the list
        setError(null);
      } catch (error: any) {
        setError(error.message || 'Failed to delete grade');
      }
    }
  };

  const handleSaveGrade = async () => {
    if (!formStudentId || !formSubject || !formGrade || formPercentage === '') {
      setError('Please fill Student, Subject, Grade, and Percentage.');
      return;
    }
    
    try {
      if (editingGrade) {
        // Update existing grade
        const updateData: GradeUpdate = {
          student_id: formStudentId as number,
          subject: formSubject,
          grade: Number(formPercentage),
          max_grade: 100,
          semester: formTerm || selectedTerm || '',
          academic_year: '2024-2025',
          notes: formAssignment,
        };
        await gradesService.update(editingGrade.id, updateData);
      } else {
        // Create new grade
        const newGrade: GradeInsert = {
          student_id: formStudentId as number,
          subject: formSubject,
          grade: Number(formPercentage),
          max_grade: 100,
          semester: formTerm || selectedTerm || '',
          academic_year: '2024-2025',
          notes: formAssignment,
        };
        await gradesService.create(newGrade);
      }
      
      await loadGrades(); // Refresh the list
      setGradeDialogOpen(false);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to save grade');
    }
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
                      <Tooltip title="Delete Grade">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteGrade(record)}
                          color="error"
                        >
                          <Delete />
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
                <Select label="Student" value={formStudentId} onChange={(e) => setFormStudentId(Number(e.target.value))}>
                  {students.length === 0 && <MenuItem value="" disabled>No students</MenuItem>}
                  {students.map(s => (
                    <MenuItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select label="Subject" value={formSubject} onChange={(e) => setFormSubject(e.target.value)}>
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
                value={formAssignment}
                onChange={(e) => setFormAssignment(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grade (A, B+, B, etc.)"
                value={formGrade}
                onChange={(e) => setFormGrade(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percentage"
                type="number"
                value={formPercentage}
                onChange={(e) => setFormPercentage(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Term</InputLabel>
                <Select label="Term" value={formTerm} onChange={(e) => setFormTerm(e.target.value)}>
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
    </Box>
  );
};

export default Grading;
