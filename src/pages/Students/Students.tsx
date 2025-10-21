import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  FilterList,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { studentsService, Student } from '../../services/database';

// Transform the database student to match component interface
interface StudentDisplay extends Student {
  firstName: string;
  lastName: string;
  enrollmentDate: string;
}

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<StudentDisplay | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [students, setStudents] = useState<StudentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state for editing
  const [form, setForm] = useState<Omit<Student, 'id' | 'created_at' | 'updated_at'>>({
    first_name: '',
    last_name: '',
    email: '',
    grade: '',
    section: '',
    status: 'Active',
    enrollment_date: '',
    avatar_url: undefined,
  });

  // Load students from Supabase
  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsService.getAll();
      // Transform data to match component interface
      const transformedStudents: StudentDisplay[] = data.map(student => ({
        ...student,
        firstName: student.first_name,
        lastName: student.last_name,
        enrollmentDate: student.enrollment_date,
      }));
      setStudents(transformedStudents);
    } catch (error: any) {
      setError(error.message || 'Failed to load students');
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || student.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Graduated': return 'info';
      default: return 'default';
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, student: StudentDisplay) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleViewStudent = () => {
    if (selectedStudent) {
      navigate(`/students/${selectedStudent.id}`);
    }
    handleMenuClose();
  };

  const handleEditStudent = () => {
    if (selectedStudent) {
      setForm({
        first_name: selectedStudent.first_name,
        last_name: selectedStudent.last_name,
        email: selectedStudent.email,
        grade: selectedStudent.grade,
        section: selectedStudent.section,
        status: selectedStudent.status,
        enrollment_date: selectedStudent.enrollment_date,
        avatar_url: selectedStudent.avatar_url,
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteStudent = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (selectedStudent) {
      try {
        await studentsService.delete(selectedStudent.id);
        // Refresh the students list
        await loadStudents();
        setError(null);
        setSuccess('Student deleted successfully');
      } catch (error: any) {
        setError(error.message || 'Failed to delete student');
      }
    }
    setDeleteDialogOpen(false);
  };

  const handleSaveStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      const updateData = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        grade: form.grade,
        section: form.section,
        status: form.status,
        enrollment_date: form.enrollment_date,
        avatar_url: form.avatar_url,
      };
      
      await studentsService.update(selectedStudent.id, updateData);
      await loadStudents();
      setEditDialogOpen(false);
      setError(null);
      setSuccess('Student updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update student');
    }
  };

  const handleFormChange = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: (params) => (
        <Avatar sx={{ width: 32, height: 32 }}>
          {params.row.firstName[0]}{params.row.lastName[0]}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.row.firstName} {params.row.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'grade',
      headerName: 'Grade',
      width: 100,
      renderCell: (params) => (
        <Chip label={`Grade ${params.row.grade}`} size="small" variant="outlined" />
      ),
    },
    {
      field: 'section',
      headerName: 'Section',
      width: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          size="small"
          color={getStatusColor(params.row.status) as any}
        />
      ),
    },
    {
      field: 'enrollmentDate',
      headerName: 'Enrolled',
      width: 120,
      renderCell: (params) => new Date(params.row.enrollmentDate).toLocaleDateString(),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={() => navigate(`/students/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => {
            setSelectedStudent(params.row);
            setForm({
              first_name: params.row.first_name,
              last_name: params.row.last_name,
              email: params.row.email,
              grade: params.row.grade,
              section: params.row.section,
              status: params.row.status,
              enrollment_date: params.row.enrollment_date,
              avatar_url: params.row.avatar_url,
            });
            setEditDialogOpen(true);
          }}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => {
            setSelectedStudent(params.row);
            setDeleteDialogOpen(true);
          }}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Students</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/enrollment')}
        >
          Add Student
        </Button>
      </Box>

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
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <SelectMenuItem value="All">All</SelectMenuItem>
                <SelectMenuItem value="Active">Active</SelectMenuItem>
                <SelectMenuItem value="Inactive">Inactive</SelectMenuItem>
                <SelectMenuItem value="Graduated">Graduated</SelectMenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
            >
              More Filters
            </Button>
          </Box>

          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredStudents}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedStudent?.firstName} {selectedStudent?.lastName}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={form.first_name}
                onChange={(e) => handleFormChange('first_name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={form.last_name}
                onChange={(e) => handleFormChange('last_name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Avatar URL"
                value={form.avatar_url || ''}
                onChange={(e) => handleFormChange('avatar_url', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <Select
                  label="Grade"
                  value={form.grade}
                  onChange={(e) => handleFormChange('grade', e.target.value)}
                >
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(grade => (
                    <SelectMenuItem key={grade} value={grade}>
                      Grade {grade}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Section</InputLabel>
                <Select
                  label="Section"
                  value={form.section}
                  onChange={(e) => handleFormChange('section', e.target.value)}
                >
                  {['A', 'B', 'C', 'D', 'E'].map(section => (
                    <SelectMenuItem key={section} value={section}>
                      Section {section}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={form.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <SelectMenuItem value="Active">Active</SelectMenuItem>
                  <SelectMenuItem value="Inactive">Inactive</SelectMenuItem>
                  <SelectMenuItem value="Graduated">Graduated</SelectMenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Enrollment Date"
                type="date"
                value={form.enrollment_date}
                onChange={(e) => handleFormChange('enrollment_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveStudent}
            disabled={!form.first_name || !form.last_name || !form.email || !form.enrollment_date}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Students;
