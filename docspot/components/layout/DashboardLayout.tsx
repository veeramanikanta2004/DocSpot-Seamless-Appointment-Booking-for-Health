
import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading dashboard...</p></div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return (
    <div className="flex min-h-[calc(100vh-var(--navbar-height,64px)-var(--footer-height,72px))]"> {/* Adjust based on actual Navbar/Footer height */}
      <Sidebar role={user.role} />
      <div className="flex-grow ml-64 p-6 bg-brand-background"> {/* ml-64 for sidebar width */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
