
import React, { useState, useEffect, useCallback } from 'react';
import { Appointment, AppointmentStatus } from '../../types';
import { MOCK_APPOINTMENTS } from '../../constants';
import PageTitle from '../../components/common/PageTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { EyeIcon, FlagIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

const AdminManageAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');


  const fetchAppointments = useCallback(() => {
    // Simulate API call - admin sees all appointments
    let filtered = MOCK_APPOINTMENTS;
    if (filterStatus) {
        filtered = filtered.filter(app => app.status === filterStatus);
    }
    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(app => 
            app.patientName.toLowerCase().includes(lowerSearchTerm) ||
            app.doctorName.toLowerCase().includes(lowerSearchTerm) ||
            app.id.toLowerCase().includes(lowerSearchTerm)
        );
    }
    setAppointments(filtered.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [filterStatus, searchTerm]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleViewAppointment = (appointmentId: string) => {
    alert(`Viewing details for appointment ${appointmentId}. (Feature in development)`);
  };

  const handleFlagAppointment = (appointmentId: string) => {
    alert(`Flagging appointment ${appointmentId} for review. (Feature in development)`);
    setMessage({ type: 'info', text: `Appointment ${appointmentId} flagged.` });
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleResolveDispute = (appointmentId: string) => {
     alert(`Opening dispute resolution for appointment ${appointmentId}. (Feature in development)`);
     setMessage({ type: 'info', text: `Dispute resolution initiated for ${appointmentId}.` });
     setTimeout(() => setMessage(null), 3000);
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.values(AppointmentStatus).map(s => ({ value: s, label: s }))
  ];
  
  const getStatusColorClass = (status: AppointmentStatus) => {
    switch (status) {
        case AppointmentStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case AppointmentStatus.SCHEDULED: return 'bg-blue-100 text-blue-800';
        case AppointmentStatus.COMPLETED: return 'bg-green-100 text-green-800';
        case AppointmentStatus.CANCELLED: return 'bg-red-100 text-red-800';
        case AppointmentStatus.REJECTED: return 'bg-pink-100 text-pink-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="Manage All Appointments" subtitle="Oversee and manage all appointments on the platform." />
      {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} className="mb-6" />}

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="searchTerm" className="block text-sm font-medium text-brand-text-secondary mb-1">Search (ID, Patient, Doctor):</label>
                <input
                    id="searchTerm"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter search term..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                />
            </div>
            <div>
                <label htmlFor="statusFilterAdmin" className="block text-sm font-medium text-brand-text-secondary mb-1">Filter by Status:</label>
                <select
                id="statusFilterAdmin"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as AppointmentStatus | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                >
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
        </div>
      </Card>

      <Card>
        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-100">
                <tr>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Appt. ID</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Patient</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Doctor</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Date & Time</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Status</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-brand-text-primary whitespace-nowrap">{appt.id.substring(0,8)}...</td>
                    <td className="py-3 px-4 text-sm text-brand-text-secondary">{appt.patientName}</td>
                    <td className="py-3 px-4 text-sm text-brand-text-secondary">{appt.doctorName}</td>
                    <td className="py-3 px-4 text-sm text-brand-text-secondary whitespace-nowrap">{new Date(appt.appointmentDate).toLocaleDateString()} {appt.appointmentTime}</td>
                    <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(appt.status)}`}>
                            {appt.status}
                        </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="secondary" onClick={() => handleViewAppointment(appt.id)} leftIcon={<EyeIcon className="h-4 w-4"/>} title="View Details"></Button>
                        <Button size="sm" variant="warning" onClick={() => handleFlagAppointment(appt.id)} leftIcon={<FlagIcon className="h-4 w-4"/>} title="Flag Appointment"></Button>
                        <Button size="sm" onClick={() => handleResolveDispute(appt.id)} className="!bg-indigo-500 hover:!bg-indigo-600" leftIcon={<AdjustmentsHorizontalIcon className="h-4 w-4"/>} title="Resolve Dispute"></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-brand-text-secondary p-4 text-center">No appointments found matching your criteria.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminManageAppointmentsPage;
