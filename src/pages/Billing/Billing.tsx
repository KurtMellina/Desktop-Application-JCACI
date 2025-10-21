import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Print,
  Payment,
  Receipt,
  FilterList,
  Visibility,
} from '@mui/icons-material';
import { studentsService, billingService, Billing as BillingType, BillingInsert, BillingUpdate } from '../../services/database';

// Transform the database billing to match component interface
interface BillingDisplay extends BillingType {
  studentName: string;
  studentId: string;
  createdDate: string;
  dueDate: string; // Add this property to match the component usage
  status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
}

const Billing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingDisplay | null>(null);
  const [invoiceList, setInvoiceList] = useState<BillingDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<{ id: number; name: string }[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    amount: 500,
    description: 'Monthly Tuition',
    dueDate: new Date().toISOString().slice(0, 10),
    status: 'Pending' as 'Pending' | 'Paid' | 'Overdue' | 'Cancelled',
    paymentMethod: '',
  });

  // Load billing and students from database
  const loadBilling = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all billing records
      const allBilling = await billingService.getAll(); // Get all billing records
      const allStudents = await studentsService.getAll();
      
      // Transform billing to match component interface
      const transformedBilling: BillingDisplay[] = allBilling.map(billing => {
        const student = allStudents.find(s => s.id === billing.student_id);
        return {
          ...billing,
          studentName: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
          studentId: `STU-${billing.student_id.toString().padStart(3, '0')}`,
          createdDate: billing.created_at.split('T')[0],
          dueDate: billing.due_date, // Map due_date to dueDate
        };
      });
      
      setInvoiceList(transformedBilling);
      
      // Set students for selection
      setStudents(allStudents.map(s => ({ 
        id: s.id, 
        name: `${s.first_name} ${s.last_name}` 
      })));
      
    } catch (error: any) {
      setError(error.message || 'Failed to load billing records');
      console.error('Error loading billing:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const filteredInvoices = invoiceList.filter(invoice => {
    const matchesSearch = 
      invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

  const getBillingStats = () => {
    const total = invoiceList.length;
    const paid = invoiceList.filter(i => i.status === 'Paid').length;
    const pending = invoiceList.filter(i => i.status === 'Pending').length;
    const overdue = invoiceList.filter(i => i.status === 'Overdue').length;
    const totalAmount = invoiceList.reduce((sum, invoice) => sum + invoice.amount, 0);
    const paidAmount = invoiceList
      .filter(i => i.status === 'Paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    const pendingAmount = invoiceList
      .filter(i => i.status === 'Pending' || i.status === 'Overdue')
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    return { total, paid, pending, overdue, totalAmount, paidAmount, pendingAmount };
  };

  const stats = getBillingStats();

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setSelectedStudentId(null);
    setInvoiceForm({
      amount: 500,
      description: 'Monthly Tuition',
      dueDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      paymentMethod: '',
    });
    setInvoiceDialogOpen(true);
  };

  const handleEditInvoice = (invoice: BillingDisplay) => {
    setSelectedInvoice(invoice);
    setSelectedStudentId(invoice.student_id);
    setInvoiceForm({
      amount: invoice.amount,
      description: invoice.description,
      dueDate: invoice.dueDate,
      status: invoice.status,
      paymentMethod: invoice.payment_method || '',
    });
    setInvoiceDialogOpen(true);
  };

  const handleViewInvoice = (invoice: BillingDisplay) => {
    // In a real app, this would open a detailed view or print the invoice
    console.log('View invoice:', invoice);
  };

  const handleDeleteInvoice = async (invoice: BillingDisplay) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.id}?`)) {
      try {
        await billingService.delete(invoice.id);
        await loadBilling(); // Refresh the list
        setError(null);
      } catch (error: any) {
        setError(error.message || 'Failed to delete invoice');
      }
    }
  };

  const handleSaveInvoice = async () => {
    try {
      if (selectedInvoice) {
        // Update existing invoice
        const updateData: BillingUpdate = {
          amount: invoiceForm.amount,
          description: invoiceForm.description,
          due_date: invoiceForm.dueDate,
          status: invoiceForm.status,
          payment_method: invoiceForm.paymentMethod,
        };
        await billingService.update(selectedInvoice.id, updateData);
      } else {
        // Create new invoice
        if (!selectedStudentId) {
          setError('Please select a student');
          return;
        }
        
        const newInvoice: BillingInsert = {
          student_id: selectedStudentId,
          amount: invoiceForm.amount,
          description: invoiceForm.description,
          due_date: invoiceForm.dueDate,
          status: invoiceForm.status,
          payment_method: invoiceForm.paymentMethod || undefined,
        };
        await billingService.create(newInvoice);
      }
      
      await loadBilling(); // Refresh the list
      setInvoiceDialogOpen(false);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to save invoice');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Billing & Invoices</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateInvoice}
        >
          Create Invoice
        </Button>
      </Box>

      {/* Billing Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2">Total Invoices</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.paid}
              </Typography>
              <Typography variant="body2">Paid</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {stats.pending}
              </Typography>
              <Typography variant="body2">Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {stats.overdue}
              </Typography>
              <Typography variant="body2">Overdue</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                ${stats.paidAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2">Paid Amount</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                ${stats.pendingAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2">Outstanding</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FilterList />}
              >
                More Filters
              </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Print />}
              >
                Print All
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Invoices ({filteredInvoices.length})
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {invoice.studentName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {invoice.studentId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.status}
                        color={getStatusColor(invoice.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Invoice">
                        <IconButton
                          size="small"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Invoice">
                        <IconButton
                          size="small"
                          onClick={() => handleEditInvoice(invoice)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Print Invoice">
                        <IconButton
                          size="small"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Print />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Invoice">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteInvoice(invoice)}
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

      {/* Create/Edit Invoice Dialog */}
      <Dialog open={invoiceDialogOpen} onClose={() => setInvoiceDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select 
                  label="Student"
                  value={selectedStudentId || ''}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Invoice ID"
                defaultValue={selectedInvoice?.id || ''}
                disabled={!!selectedInvoice}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={invoiceForm.status}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, status: e.target.value as 'Pending' | 'Paid' | 'Overdue' | 'Cancelled' }))}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select 
                  label="Payment Method"
                  value={invoiceForm.paymentMethod}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Check">Check</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={invoiceForm.description}
                onChange={(e) => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                placeholder="Additional notes or comments..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvoiceDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Payment />}
            onClick={handleSaveInvoice}
          >
            {selectedInvoice ? 'Update' : 'Create'} Invoice
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

export default Billing;
