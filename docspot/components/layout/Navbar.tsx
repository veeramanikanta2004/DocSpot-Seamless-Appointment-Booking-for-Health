
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME, ROUTES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getDashboardPath = () => {
    if (!user) return ROUTES.LANDING;
    switch (user.role) {
      case UserRole.ADMIN: return ROUTES.ADMIN_DASHBOARD;
      case UserRole.DOCTOR: return ROUTES.DOCTOR_DASHBOARD;
      case UserRole.PATIENT: return ROUTES.PATIENT_BROWSE_DOCTORS;
      default: return ROUTES.LANDING;
    }
  };

  return (
    <nav className="bg-brand-surface shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={getDashboardPath()} className="text-2xl font-bold text-brand-primary-dark hover:text-brand-primary">
          {APP_NAME}
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center text-brand-text-secondary">
                <UserCircleIcon className="h-6 w-6 mr-2 text-brand-secondary" />
                <span>Hi, {user.fullName.split(' ')[0]} ({user.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold rounded-lg shadow-sm transition duration-150 ease-in-out flex items-center"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="px-4 py-2 text-brand-text-primary hover:text-brand-primary transition duration-150">
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold rounded-lg shadow-sm transition duration-150 ease-in-out"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
