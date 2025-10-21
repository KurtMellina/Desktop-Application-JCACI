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
  Assessment,
  Download,
  Print,
  Email,
  FilterList,
  Visibility,
  Delete,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { settingsService } from '../../services/database';

interface Report {
  id: number;
  name: string;
  type: 'Attendance' | 'Academic' | 'Financial' | 'Student' | 'Staff';
  description: string;
  lastGenerated: string;
  status: 'Available' | 'Generating' | 'Error';
  fileSize: string;
}

const Reports: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportList, setReportList] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Default seed used on first run only
  const defaultReportsSeed: Report[] = [
    {
      id: 1,
      name: 'Monthly Attendance Report',
      type: 'Attendance',
      description: 'Complete attendance report for all students by grade and section',
      lastGenerated: '2024-01-15',
      status: 'Available',
      fileSize: '2.3 MB',
    },
    {
      id: 2,
      name: 'Academic Performance Report',
      type: 'Academic',
      description: 'Student grades and academic performance analysis',
      lastGenerated: '2024-01-14',
      status: 'Available',
      fileSize: '1.8 MB',
    },
    {
      id: 3,
      name: 'Financial Summary Report',
      type: 'Financial',
      description: 'Revenue, expenses, and outstanding payments summary',
      lastGenerated: '2024-01-13',
      status: 'Available',
      fileSize: '3.1 MB',
    },
    {
      id: 4,
      name: 'Student Enrollment Report',
      type: 'Student',
      description: 'Current enrollment statistics by grade and demographics',
      lastGenerated: '2024-01-12',
      status: 'Generating',
      fileSize: '1.2 MB',
    },
    {
      id: 5,
      name: 'Staff Directory Report',
      type: 'Staff',
      description: 'Complete staff directory with contact information',
      lastGenerated: '2024-01-11',
      status: 'Available',
      fileSize: '0.9 MB',
    },
  ];

  useEffect(() => {
    try {
      const raw = localStorage.getItem('reports');
      if (raw) {
        setReportList(JSON.parse(raw) as Report[]);
      } else {
        setReportList(defaultReportsSeed);
      }
    } catch {
      setReportList(defaultReportsSeed);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('reports', JSON.stringify(reportList));
    } catch {
      // ignore
    }
  }, [reportList]);

  const reportTypes = ['All', 'Attendance', 'Academic', 'Financial', 'Student', 'Staff'];

  const filteredReports = reportList.filter(report => {
    return selectedReportType === 'All' || report.type === selectedReportType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Generating': return 'warning';
      case 'Error': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Attendance': return '📊';
      case 'Academic': return '📚';
      case 'Financial': return '💰';
      case 'Student': return '👥';
      case 'Staff': return '👨‍🏫';
      default: return '📄';
    }
  };

  const handleGenerateReport = (report: Report) => {
    setSelectedReport(report);
    setGenerateDialogOpen(true);
  };

  const handleDownloadReport = (report: Report) => {
    // In a real app, this would download the report file
    console.log('Downloading report:', report);
  };

  const handlePrintReport = (report: Report) => {
    // In a real app, this would open print dialog
    console.log('Printing report:', report);
  };

  const handleEmailReport = (report: Report) => {
    // In a real app, this would open email dialog
    console.log('Emailing report:', report);
  };

  const handleDeleteReport = (report: Report) => {
    if (window.confirm(`Are you sure you want to delete report "${report.name}"?`)) {
      setReportList(prev => prev.filter(r => r.id !== report.id));
      setSuccess(true);
    }
  };

  const confirmGenerate = async () => {
    try {
      if (selectedReport) {
        setReportList(prev => prev.map(r => (
          r.id === selectedReport.id
            ? { ...r, lastGenerated: new Date().toISOString().slice(0, 10), status: 'Available' }
            : r
        )));
        setSuccess(true);
      }
      setGenerateDialogOpen(false);
    } catch (error: any) {
      setError(error.message || 'Failed to generate report');
    }
  };

  const getReportStats = () => {
    const total = reportList.length;
    const available = reportList.filter(r => r.status === 'Available').length;
    const generating = reportList.filter(r => r.status === 'Generating').length;
    const byType = reportList.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, available, generating, byType };
  };

  const stats = getReportStats();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Reports</Typography>
          <Button
            variant="contained"
            startIcon={<Assessment />}
            onClick={() => setGenerateDialogOpen(true)}
          >
            Generate Report
          </Button>
        </Box>

        {/* Report Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2">Total Reports</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {stats.available}
                </Typography>
                <Typography variant="body2">Available</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {stats.generating}
                </Typography>
                <Typography variant="body2">Generating</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {Object.keys(stats.byType).length}
                </Typography>
                <Typography variant="body2">Report Types</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filter Reports
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                    label="Report Type"
                  >
                    {reportTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Start Date"
                  value={selectedDateRange.start}
                  onChange={(newValue) => setSelectedDateRange(prev => ({ ...prev, start: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="End Date"
                  value={selectedDateRange.end}
                  onChange={(newValue) => setSelectedDateRange(prev => ({ ...prev, end: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<FilterList />}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Available Reports ({filteredReports.length})
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Last Generated</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>File Size</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">{getTypeIcon(report.type)}</Typography>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {report.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {report.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{report.description}</TableCell>
                      <TableCell>{new Date(report.lastGenerated).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          color={getStatusColor(report.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{report.fileSize}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Report">
                          <IconButton
                            size="small"
                            onClick={() => handleGenerateReport(report)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Report">
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadReport(report)}
                            disabled={report.status !== 'Available'}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Report">
                          <IconButton
                            size="small"
                            onClick={() => handlePrintReport(report)}
                            disabled={report.status !== 'Available'}
                          >
                            <Print />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Email Report">
                          <IconButton
                            size="small"
                            onClick={() => handleEmailReport(report)}
                            disabled={report.status !== 'Available'}
                          >
                            <Email />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Report">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteReport(report)}
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

        {/* Generate Report Dialog */}
        <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select label="Report Type" defaultValue="Attendance">
                    <MenuItem value="Attendance">Attendance Report</MenuItem>
                    <MenuItem value="Academic">Academic Performance</MenuItem>
                    <MenuItem value="Financial">Financial Summary</MenuItem>
                    <MenuItem value="Student">Student Enrollment</MenuItem>
                    <MenuItem value="Staff">Staff Directory</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select label="Format" defaultValue="PDF">
                    <MenuItem value="PDF">PDF</MenuItem>
                    <MenuItem value="Excel">Excel</MenuItem>
                    <MenuItem value="CSV">CSV</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={selectedDateRange.start}
                  onChange={(newValue) => setSelectedDateRange(prev => ({ ...prev, start: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={selectedDateRange.end}
                  onChange={(newValue) => setSelectedDateRange(prev => ({ ...prev, end: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Recipients (Optional)"
                  placeholder="Enter email addresses separated by commas"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGenerateDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              startIcon={<Assessment />}
              onClick={confirmGenerate}
            >
              Generate Report
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
            Operation completed successfully!
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;
