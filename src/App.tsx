import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Alert, Snackbar } from '@mui/material';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/Students/Students';
import StudentProfile from './pages/Students/StudentProfile';
import Enrollment from './pages/Enrollment/Enrollment';
import Attendance from './pages/Attendance/Attendance';
import Grading from './pages/Grading/Grading';
import Billing from './pages/Billing/Billing';
import Staff from './pages/Staff/Staff';
import Communications from './pages/Communications/Communications';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import { authService, User } from './services/auth';

// Authentication hook using Supabase
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.signIn(credentials);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { isAuthenticated, user, login, logout, loading, error, setError };
};

function App() {
  const { isAuthenticated, user, login, logout, loading, error, setError } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Box>Loading...</Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={login} />
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Layout user={user} onLogout={logout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/enrollment" element={<Enrollment />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/grading" element={<Grading />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;
