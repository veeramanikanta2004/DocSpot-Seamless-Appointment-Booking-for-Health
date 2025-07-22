
import React, { useState, useEffect, useCallback } from 'react';
import { Appointment, AppointmentStatus, UserRole, Doctor, DoctorApplicationStatus } from '../../types';
import { MOCK_APPOINTMENTS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import PageTitle from '../../components/common/PageTitle';
import AppointmentCard from '../../components/Appointment/AppointmentCard';
import Alert from '../../components/common/Alert';
import Input, { Textarea } from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card'; // For modal-like summary form

interface SummaryFormData {
  visitSummary: string;
  prescription: string;
}

const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | ''>('');
  
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [summaryFormData, setSummaryFormData] = useState<SummaryFormData>({ visitSummary: '', prescription: '' });


  const fetchAppointments = useCallback(() => {
    if (user && user.role === UserRole.DOCTOR) {
      // Simulate API call
      const doctorAppointments = MOCK_APPOINTMENTS.filter(app => app.doctorId === user.id)
        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Show newest first
      setAppointments(doctorAppointments);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus, alertMessage: string) => {
    // Simulate API call
    const appIndex = MOCK_APPOINTMENTS.findIndex(a => a.id === appointmentId);
    if (appIndex !== -1) {
        MOCK_APPOINTMENTS[appIndex].status = status;
        setMessage({ type: 'success', text: alertMessage });
        fetchAppointments(); // Re-fetch
    } else {
        setMessage({ type: 'error', text: `Failed to update appointment ${appointmentId}.` });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleApprove = (appointmentId: string) => updateAppointmentStatus(appointmentId, AppointmentStatus.SCHEDULED, `Appointment ${appointmentId} approved and scheduled.`);
  const handleReject = (appointmentId: string) => updateAppointmentStatus(appointmentId, AppointmentStatus.REJECTED, `Appointment ${appointmentId} rejected.`);
  const handleComplete = (appointmentId: string) => updateAppointmentStatus(appointmentId, AppointmentStatus.COMPLETED, `Appointment ${appointmentId} marked as completed.`);
  
  const handleReschedule = (appointmentId: string) => {
    console.log(`Reschedule ${appointmentId}`);
    setMessage({ type: 'info', text: `Reschedule functionality for ${appointmentId} is in development.`});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleOpenUploadSummary = (appointmentId: string) => {
    const appointment = MOCK_APPOINTMENTS.find(a => a.id === appointmentId);
    if (appointment) {
        setEditingAppointmentId(appointmentId);
        setSummaryFormData({
            visitSummary: appointment.visitSummary || '',
            prescription: appointment.prescription || '',
        });
    }
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSummaryFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointmentId) return;
    const appIndex = MOCK_APPOINTMENTS.findIndex(a => a.id === editingAppointmentId);
    if (appIndex !== -1) {
        MOCK_APPOINTMENTS[appIndex].visitSummary = summaryFormData.visitSummary;
        MOCK_APPOINTMENTS[appIndex].prescription = summaryFormData.prescription;
        setMessage({ type: 'success', text: `Summary for appointment ${editingAppointmentId} saved.` });
        fetchAppointments();
        setEditingAppointmentId(null); // Close "modal"
    } else {
        setMessage({ type: 'error', text: `Failed to save summary for appointment ${editingAppointmentId}.` });
    }
     setTimeout(() => setMessage(null), 3000);
  };


  const filteredAppointments = appointments.filter(app => filterStatus ? app.status === filterStatus : true);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.values(AppointmentStatus).map(s => ({ value: s, label: s }))
  ];

  if (!user || user.role !== UserRole.DOCTOR) {
    return <div className="container mx-auto py-8 px-4">Loading user data or invalid access...</div>;
  }
  const doctorUser = user as Doctor;
  if (doctorUser.applicationStatus !== DoctorApplicationStatus.APPROVED) { 
      // This case should be handled by ProtectedRoute to show DoctorRegistrationPendingPage
      // For instance, if status is PENDING_APPROVAL or REJECTED
      // return <div className="container mx-auto py-8 px-4"><Alert type="warning" message="Your registration is still pending approval or has been rejected." /></div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="My Appointments Dashboard" subtitle="Manage your patient appointments." />

      {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} className="mb-6" />}
      
      {editingAppointmentId && (
        <Card title={`Add Summary/Prescription for Apt ID: ${editingAppointmentId}`} className="mb-6 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" titleClassName="text-white">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Add Summary/Prescription (Apt ID: {editingAppointmentId})</h3>
            <form onSubmit={handleSaveSummary} className="space-y-4">
              <Textarea
                label="Visit Summary"
                name="visitSummary"
                value={summaryFormData.visitSummary}
                onChange={handleSummaryChange}
                rows={4}
              />
              <Textarea
                label="Prescription"
                name="prescription"
                value={summaryFormData.prescription}
                onChange={handleSummaryChange}
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => setEditingAppointmentId(null)} className="!bg-gray-300 !text-gray-700 hover:!bg-gray-400">Cancel</Button>
                <Button type="submit" variant="primary">Save Summary</Button>
              </div>
            </form>
          </div>
        </Card>
      )}


      <div className="mb-6 p-4 bg-brand-surface rounded-lg shadow">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-brand-text-secondary mb-1">Filter by Status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as AppointmentStatus | '')}
          className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
        >
          {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="space-y-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              userRole={UserRole.DOCTOR}
              onApprove={handleApprove}
              onReject={handleReject}
              onComplete={handleComplete}
              onReschedule={handleReschedule}
              onUploadSummary={handleOpenUploadSummary}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <img src="https://picsum.photos/seed/nodoctorappts/200/200" alt="No appointments" className="mx-auto mb-4 rounded-lg w-48 h-48" />
          <p className="text-xl text-brand-text-secondary">No appointments found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardPage;
