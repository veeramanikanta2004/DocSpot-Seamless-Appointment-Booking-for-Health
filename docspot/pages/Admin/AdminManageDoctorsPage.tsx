
import React, { useState, useEffect, useCallback } from 'react';
import { Doctor, User, UserRole, DoctorApplication, DoctorApplicationStatus } from '../../types';
import { MOCK_USERS, MOCK_DOCTOR_APPLICATIONS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import PageTitle from '../../components/common/PageTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/solid';

const AdminManageDoctorsPage: React.FC = () => {
  const [pendingApplications, setPendingApplications] = useState<DoctorApplication[]>([]);
  const [approvedDoctors, setApprovedDoctors] = useState<Doctor[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { updateUserDoctorApplicationStatus } = useAuth(); // This hook also needs to update MOCK_USERS for role/status

  const fetchData = useCallback(() => {
    // Simulate API calls
    const apps = MOCK_DOCTOR_APPLICATIONS.filter(app => app.status === DoctorApplicationStatus.PENDING_APPROVAL)
      .sort((a,b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()); // Oldest first
    setPendingApplications(apps);

    const doctors = MOCK_USERS.filter(user => user.role === UserRole.DOCTOR && (user as Doctor).applicationStatus === DoctorApplicationStatus.APPROVED) as Doctor[];
    setApprovedDoctors(doctors);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApplicationUpdate = (applicationId: string, applicantUserId: string, newStatus: DoctorApplicationStatus.APPROVED | DoctorApplicationStatus.REJECTED) => {
    // Simulate API call to update application
    const appIndex = MOCK_DOCTOR_APPLICATIONS.findIndex(app => app.id === applicationId);
    if (appIndex !== -1) {
      MOCK_DOCTOR_APPLICATIONS[appIndex].status = newStatus;

      // Also update the user's role and doctor status in MOCK_USERS if approved
      const userIndex = MOCK_USERS.findIndex(u => u.id === applicantUserId);
      if (userIndex !== -1) {
        if (newStatus === DoctorApplicationStatus.APPROVED) {
          const originalUser = MOCK_USERS[userIndex];
          const doctorApplicationDetails = MOCK_DOCTOR_APPLICATIONS[appIndex];
          // "Upgrade" user to Doctor
          MOCK_USERS[userIndex] = {
            ...originalUser,
            role: UserRole.DOCTOR,
            specialization: doctorApplicationDetails.specialization,
            experience: doctorApplicationDetails.experience,
            fees: doctorApplicationDetails.fees,
            timings: doctorApplicationDetails.timings,
            address: doctorApplicationDetails.address,
            applicationStatus: DoctorApplicationStatus.APPROVED,
          } as Doctor;
          updateUserDoctorApplicationStatus(applicantUserId, DoctorApplicationStatus.APPROVED); // Inform auth context
        } else { // Rejected
             (MOCK_USERS[userIndex] as Doctor).applicationStatus = DoctorApplicationStatus.REJECTED; // Or remove doctor specific fields if they were temporary
             updateUserDoctorApplicationStatus(applicantUserId, DoctorApplicationStatus.REJECTED); // Inform auth context
        }
      }
      
      setMessage({ type: 'success', text: `Application ${applicationId} has been ${newStatus.toLowerCase()}.` });
      fetchData(); // Re-fetch to update lists
    } else {
      setMessage({ type: 'error', text: `Failed to update application ${applicationId}.` });
    }
    setTimeout(() => setMessage(null), 3000);
  };
  
  const renderApplicationRow = (app: DoctorApplication) => (
    <tr key={app.id} className="border-b hover:bg-slate-50">
      <td className="py-3 px-4 text-sm text-brand-text-primary">{app.fullName}</td>
      <td className="py-3 px-4 text-sm text-brand-text-secondary">{app.email}</td>
      <td className="py-3 px-4 text-sm text-brand-text-secondary">{app.specialization}</td>
      <td className="py-3 px-4 text-sm text-brand-text-secondary">{new Date(app.submittedAt).toLocaleDateString()}</td>
      <td className="py-3 px-4 text-sm">
        <div className="flex space-x-2">
          <Button size="sm" variant="success" onClick={() => handleApplicationUpdate(app.id, app.userId, DoctorApplicationStatus.APPROVED)} leftIcon={<CheckCircleIcon className="h-4 w-4"/>}>Approve</Button>
          <Button size="sm" variant="danger" onClick={() => handleApplicationUpdate(app.id, app.userId, DoctorApplicationStatus.REJECTED)} leftIcon={<XCircleIcon className="h-4 w-4"/>}>Reject</Button>
        </div>
      </td>
    </tr>
  );

  const renderDoctorRow = (doc: Doctor) => (
     <tr key={doc.id} className="border-b hover:bg-slate-50">
      <td className="py-3 px-4 text-sm text-brand-text-primary">{doc.fullName}</td>
      <td className="py-3 px-4 text-sm text-brand-text-secondary">{doc.email}</td>
      <td className="py-3 px-4 text-sm text-brand-text-secondary">{doc.specialization}</td>
      <td className="py-3 px-4 text-sm text-brand-text-secondary">{doc.phone}</td>
      <td className="py-3 px-4 text-sm">
        <Button size="sm" variant="secondary" onClick={() => alert(`View details for ${doc.fullName}`)} leftIcon={<EyeIcon className="h-4 w-4"/>}>View</Button>
      </td>
    </tr>
  );


  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="Manage Doctors" subtitle="Approve new doctor registrations and view existing doctors." />
      {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} className="mb-6" />}

      <Card title="Pending Doctor Applications" className="mb-8">
        {pendingApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-100">
                <tr>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Name</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Email</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Specialization</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Submitted</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>{pendingApplications.map(renderApplicationRow)}</tbody>
            </table>
          </div>
        ) : (
          <p className="text-brand-text-secondary p-4">No pending doctor applications.</p>
        )}
      </Card>

      <Card title="Approved Doctors">
         {approvedDoctors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-100">
                <tr>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Name</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Email</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Specialization</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Phone</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>{approvedDoctors.map(renderDoctorRow)}</tbody>
            </table>
          </div>
        ) : (
          <p className="text-brand-text-secondary p-4">No approved doctors yet.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminManageDoctorsPage;
