import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import AuthPage from './pages/AuthPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ClientDashboard from './pages/ClientDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import ResponsibleDashboard from './pages/ResponsibleDashboard';
import MedicationList from './pages/MedicationList';
import AddMedication from './pages/AddMedication';
import EditMedication from './pages/EditMedication';
import MedicationDetails from './pages/MedicationDetails';
import Schedule from './pages/Schedule';
import TravelMode from './pages/TravelMode';
import NotFound from './pages/NotFound';

// Context
import { useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth, USER_TYPES } from './context/AuthContext';

// Dashboard selector component based on user type
const DashboardSelector = () => {
  const { currentUser, userType } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  switch (userType) {
    case USER_TYPES.CLIENT:
      return <ClientDashboard />;
    case USER_TYPES.CAREGIVER:
      return <CaregiverDashboard />;
    case USER_TYPES.RESPONSIBLE:
      return <ResponsibleDashboard />;
    default:
      return <ClientDashboard />;
  }
};

function App() {
  const { theme, mode } = useTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode}
      />
      <GlobalStyles
        styles={{
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
            minHeight: '100vh',
            overflowX: 'hidden',
          },
          '::selection': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
        }}
      />
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <Routes>
              {/* Public routes with flip card animation */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              
              {/* Protected routes with Layout */}
              <Route element={<Layout />}>
                {/* Dashboard route - redirects based on user type */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <DashboardSelector />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Common protected routes for all user types */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Routes primarily for clients and caregivers */}
                <Route 
                  path="/medications" 
                  element={
                    <ProtectedRoute requiredUserTypes={[USER_TYPES.CLIENT, USER_TYPES.CAREGIVER]}>
                      <MedicationList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-medication" 
                  element={
                    <ProtectedRoute requiredUserTypes={[USER_TYPES.CLIENT, USER_TYPES.CAREGIVER]}>
                      <AddMedication />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/medications/edit/:id" 
                  element={
                    <ProtectedRoute requiredUserTypes={[USER_TYPES.CLIENT, USER_TYPES.CAREGIVER]}>
                      <EditMedication />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/medication/:id" 
                  element={
                    <ProtectedRoute>
                      <MedicationDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/schedule" 
                  element={
                    <ProtectedRoute>
                      <Schedule />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/travel" 
                  element={
                    <ProtectedRoute requiredUserTypes={[USER_TYPES.CLIENT]}>
                      <TravelMode />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </LocalizationProvider>
      </AuthProvider>
    </MuiThemeProvider>
  );
}

export default App;
