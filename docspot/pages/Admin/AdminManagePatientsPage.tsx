
import React, { useState, useEffect, useCallback } from 'react';
import { Patient, UserRole } from '../../types';
import { MOCK_USERS } from '../../constants';
import PageTitle from '../../components/common/PageTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { EyeIcon, TrashIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid'; // Using solid for actions

const AdminManagePatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const fetchPatients = useCallback(() => {
    // Simulate API call
    const fetchedPatients = MOCK_USERS.filter(user => user.role === UserRole.PATIENT) as Patient[];
    setPatients(fetchedPatients);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleViewPatient = (patientId: string) => {
    // Navigate to a patient detail page or show a modal
    alert(`Viewing details for patient ${patientId}. (Feature in development)`);
  };

  const handleDeletePatient = (patientId: string) => {
    // Simulate API call to delete patient
    const patientIndex = MOCK_USERS.findIndex(u => u.id === patientId);
    if (patientIndex !== -1) {
        MOCK_USERS.splice(patientIndex, 1); // Remove from mock data
        setMessage({ type: 'success', text: `Patient ${patientId} deleted successfully.` });
        fetchPatients(); // Re-fetch
    } else {
        setMessage({ type: 'error', text: `Failed to delete patient ${patientId}.` });
    }
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleFlagPatient = (patientId: string) => {
     alert(`Flagging patient ${patientId} for review. (Feature in development)`);
     setMessage({ type: 'info', text: `Patient ${patientId} flagged for review.` });
     setTimeout(() => setMessage(null), 3000);
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="Manage Patients" subtitle="View and manage patient accounts on the platform." />
      {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} className="mb-6" />}

      <Card>
        {patients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-100">
                <tr>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Name</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Email</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Phone</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Joined On (Simulated)</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-brand-text-primary">{patient.fullName}</td>
                    <td className="py-3 px-4 text-sm text-brand-text-secondary">{patient.email}</td>
                    <td className="py-3 px-4 text-sm text-brand-text-secondary">{patient.phone}</td>
                    <td className="py-3 px-4 text-sm text-brand-text-secondary">{new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => handleViewPatient(patient.id)} leftIcon={<EyeIcon className="h-4 w-4"/>}>View</Button>
                        <Button size="sm" variant="warning" onClick={() => handleFlagPatient(patient.id)} leftIcon={<ShieldExclamationIcon className="h-4 w-4"/>}>Flag</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeletePatient(patient.id)} leftIcon={<TrashIcon className="h-4 w-4"/>}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-brand-text-secondary p-4">No patients found.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminManagePatientsPage;
