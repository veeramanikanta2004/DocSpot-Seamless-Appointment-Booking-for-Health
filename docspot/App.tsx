
import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'; // Added useLocation
import { ROUTES } from './constants';
import { useAuth } from './hooks/useAuth';
import { UserRole, DoctorApplicationStatus } from './types';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Patient Pages
import PatientBrowseDoctorsPage from './pages/Patient/PatientBrowseDoctorsPage';
import PatientBookAppointmentPage from './pages/Patient/PatientBookAppointmentPage';
import PatientAppointmentsPage from './pages/Patient/PatientAppointmentsPage';
import PatientApplyDoctorPage from './pages/Patient/PatientApplyDoctorPage';

// Doctor Pages
import DoctorDashboardPage from './pages/Doctor/DoctorDashboardPage';
import DoctorRegistrationPendingPage from './pages/Doctor/DoctorRegistrationPendingPage';

// Admin Pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminManageDoctorsPage from './pages/Admin/AdminManageDoctorsPage';
import AdminManagePatientsPage from './pages/Admin/AdminManagePatientsPage';
import AdminManageAppointmentsPage from './pages/Admin/AdminManageAppointmentsPage';


interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps & { children?: React.ReactNode }> = ({ allowedRoles, children }) => {
  const { user, 医生申请状态 } = useAuth(); 
  const location = useLocation(); // Get current location

  if (!user) {
    // Pass current location in state so LoginPage can redirect back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.LANDING} replace />; // Or a dedicated "Unauthorized" page
  }

  // Handle doctor pending approval state
  if (user.role === UserRole.DOCTOR && 医生申请状态 === DoctorApplicationStatus.PENDING_APPROVAL) { 
      if (location.pathname !== ROUTES.DOCTOR_REGISTRATION_PENDING) { // Check location.pathname
         return <Navigate to={ROUTES.DOCTOR_REGISTRATION_PENDING} replace />;
      }
  }


  return children ? <>{children}</> : <Outlet />;
};


const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LANDING} element={<LandingPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          
          {/* This route needs to be accessible for doctors pending approval, even if they are "logged in" */}
          <Route path={ROUTES.DOCTOR_REGISTRATION_PENDING} element={<DoctorRegistrationPendingPage />} />


          {/* Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.PATIENT]} />}>
            <Route path={ROUTES.PATIENT_BROWSE_DOCTORS} element={<DashboardLayout><PatientBrowseDoctorsPage /></DashboardLayout>} />
            {/* Ensure :id matches the param name used in PatientBookAppointmentPage */}
            <Route path={ROUTES.PATIENT_BOOK_APPOINTMENT.replace(':doctorId',':id')} element={<DashboardLayout><PatientBookAppointmentPage /></DashboardLayout>} />
            <Route path={ROUTES.PATIENT_APPOINTMENTS} element={<DashboardLayout><PatientAppointmentsPage /></DashboardLayout>} />
            <Route path={ROUTES.PATIENT_APPLY_DOCTOR} element={<DashboardLayout><PatientApplyDoctorPage /></DashboardLayout>} />
          </Route>

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.DOCTOR]} />}>
             <Route path={ROUTES.DOCTOR_DASHBOARD} element={<DashboardLayout><DoctorDashboardPage /></DashboardLayout>} />
            {/* Add more doctor routes here, e.g., profile */}
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
            <Route path={ROUTES.ADMIN_MANAGE_DOCTORS} element={<DashboardLayout><AdminManageDoctorsPage /></DashboardLayout>} />
            <Route path={ROUTES.ADMIN_MANAGE_PATIENTS} element={<DashboardLayout><AdminManagePatientsPage /></DashboardLayout>} />
            <Route path={ROUTES.ADMIN_MANAGE_APPOINTMENTS} element={<DashboardLayout><AdminManageAppointmentsPage /></DashboardLayout>} />
          </Route>

          {/* Fallback Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
