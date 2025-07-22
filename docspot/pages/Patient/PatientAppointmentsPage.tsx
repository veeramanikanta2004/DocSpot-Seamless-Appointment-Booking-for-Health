
import React, { useState, useEffect, useCallback } from 'react';
import { Appointment, AppointmentStatus, UserRole } from '../../types';
import { MOCK_APPOINTMENTS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import PageTitle from '../../components/common/PageTitle';
import AppointmentCard from '../../components/Appointment/AppointmentCard';
import Alert from '../../components/common/Alert';
// Modal component would be useful for cancel/reschedule confirmations

const PatientAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAppointments = useCallback(() => {
    if (user && user.role === UserRole.PATIENT) {
      // Simulate API call
      const userAppointments = MOCK_APPOINTMENTS.filter(app => app.patientId === user.id)
        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Show newest first
      setAppointments(userAppointments);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelAppointment = (appointmentId: string) => {
    // Simulate API call
    console.log(`Cancelling appointment ${appointmentId}`);
    const appIndex = MOCK_APPOINTMENTS.findIndex(a => a.id === appointmentId);
    if (appIndex !== -1 && (MOCK_APPOINTMENTS[appIndex].status === AppointmentStatus.PENDING || MOCK_APPOINTMENTS[appIndex].status === AppointmentStatus.SCHEDULED)) {
        MOCK_APPOINTMENTS[appIndex].status = AppointmentStatus.CANCELLED;
        setMessage({ type: 'success', text: `Appointment ${appointmentId} cancelled successfully.` });
        fetchAppointments(); // Re-fetch to update UI
    } else {
        setMessage({ type: 'error', text: `Could not cancel appointment ${appointmentId}. It may have already started or been completed.` });
    }
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleRescheduleAppointment = (appointmentId: string) => {
    // This would typically open a modal to select a new date/time
    console.log(`Rescheduling appointment ${appointmentId}`);
    setMessage({ type: 'success', text: `Reschedule request for ${appointmentId} initiated. (Feature in development)` });
    setTimeout(() => setMessage(null), 3000);
  };


  if (!user) {
    return <div className="container mx-auto py-8 px-4">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="My Appointments" subtitle="View and manage your upcoming and past appointments." />

      {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} className="mb-6" />}

      {appointments.length > 0 ? (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              userRole={UserRole.PATIENT}
              onCancel={handleCancelAppointment}
              onReschedule={handleRescheduleAppointment}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <img src="https://picsum.photos/seed/noappointments/200/200" alt="No appointments" className="mx-auto mb-4 rounded-lg w-48 h-48" />
          <p className="text-xl text-brand-text-secondary">You have no appointments scheduled.</p>
          <p className="text-brand-text-secondary">Visit the 'Browse Doctors' page to book one.</p>
        </div>
      )}
    </div>
  );
};

export default PatientAppointmentsPage;
