
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, Doctor } from '../../types';
import PageTitle from '../../components/common/PageTitle';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

const DoctorRegistrationPendingPage: React.FC = () => {
  const { user,医生申请状态 } = useAuth(); // Renamed: Consistent with useAuth hook

  if (!user || user.role !== UserRole.DOCTOR) {
    // This page is only for doctors, redirect if not a doctor or not logged in
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If somehow user.applicationStatus is approved, redirect to dashboard.
  // The ProtectedRoute in App.tsx should ideally handle this.
  const doctorUser = user as Doctor;
  if (医生申请状态 === 'Approved') { // Renamed: Consistent with useAuth hook
    return <Navigate to={ROUTES.DOCTOR_DASHBOARD} replace />;
  }
   if (医生申请状态 === 'Rejected') { // Renamed: Consistent with useAuth hook
    return (
      <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <PageTitle title="Application Status" />
        <Card className="max-w-lg w-full text-center">
          <Alert type="error" title="Application Rejected" message="We regret to inform you that your application to become a doctor has been rejected. Please contact support for more information."/>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <PageTitle title="Registration Pending Approval" />
        <Card className="max-w-lg w-full text-center">
            <ClockIcon className="h-16 w-16 text-brand-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-brand-text-primary mb-3">Thank you for registering, {user.fullName}!</h2>
            <p className="text-brand-text-secondary mb-2">
                Your application to join {`${"DocSpot"}`} as a doctor is currently under review.
            </p>
            <p className="text-brand-text-secondary mb-6">
                You will be notified via email once your application has been processed. This usually takes 1-2 business days.
            </p>
            <Alert type="info" message="You can log out and check back later. Access to the doctor dashboard will be granted upon approval." />
        </Card>
    </div>
  );
};

export default DoctorRegistrationPendingPage;
