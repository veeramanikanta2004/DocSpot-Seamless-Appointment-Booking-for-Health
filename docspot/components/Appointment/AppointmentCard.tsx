
import React from 'react';
import { Appointment, AppointmentStatus, UserRole } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon, PencilSquareIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface AppointmentCardProps {
  appointment: Appointment;
  userRole: UserRole;
  onCancel?: (appointmentId: string) => void; // For patient
  onReschedule?: (appointmentId: string) => void; // For patient/doctor
  onApprove?: (appointmentId: string) => void; // For doctor
  onReject?: (appointmentId: string) => void; // For doctor
  onComplete?: (appointmentId: string) => void; // For doctor
  onUploadSummary?: (appointmentId: string) => void; // For doctor
}

const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.PENDING: return 'text-brand-pending border-brand-pending';
    case AppointmentStatus.SCHEDULED: return 'text-brand-scheduled border-brand-scheduled';
    case AppointmentStatus.COMPLETED: return 'text-brand-completed border-brand-completed';
    case AppointmentStatus.CANCELLED: return 'text-brand-cancelled border-brand-cancelled';
    case AppointmentStatus.REJECTED: return 'text-brand-rejected border-brand-rejected';
    default: return 'text-gray-500 border-gray-500';
  }
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  userRole,
  onCancel,
  onReschedule,
  onApprove,
  onReject,
  onComplete,
  onUploadSummary,
}) => {
  const isPastAppointment = new Date(appointment.appointmentDate) < new Date() && appointment.status !== AppointmentStatus.COMPLETED && appointment.status !== AppointmentStatus.CANCELLED;

  return (
    <Card className={`mb-4 ${isPastAppointment ? 'opacity-70 bg-slate-50' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 pb-3 border-b">
        <div>
          <h3 className="text-xl font-semibold text-brand-text-primary">
            {userRole === UserRole.PATIENT ? `Dr. ${appointment.doctorName}` : `Patient: ${appointment.patientName}`}
          </h3>
          {userRole === UserRole.PATIENT && <p className="text-sm text-brand-secondary">{appointment.doctorSpecialization}</p>}
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-brand-text-secondary mb-4">
        <p className="flex items-center"><CalendarIcon className="h-5 w-5 mr-2 text-brand-primary" /> Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        <p className="flex items-center"><ClockIcon className="h-5 w-5 mr-2 text-brand-primary" /> Time: {appointment.appointmentTime}</p>
        {userRole === UserRole.DOCTOR && appointment.patientId && 
          <p className="flex items-center"><UserIcon className="h-5 w-5 mr-2 text-brand-primary" /> Patient ID: {appointment.patientId}</p>
        }
         {appointment.reason && 
            <p className="sm:col-span-2 flex items-start"><InformationCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-brand-primary flex-shrink-0" /> Reason: {appointment.reason}</p>
        }
      </div>

      {(appointment.visitSummary || appointment.prescription) && userRole === UserRole.PATIENT && (
        <div className="mt-3 pt-3 border-t text-sm">
            {appointment.visitSummary && <p><strong>Summary:</strong> {appointment.visitSummary}</p>}
            {appointment.prescription && <p><strong>Prescription:</strong> {appointment.prescription}</p>}
        </div>
      )}


      <div className="mt-4 pt-4 border-t flex flex-wrap gap-2 justify-end">
        {userRole === UserRole.PATIENT && (
          <>
            { (appointment.status === AppointmentStatus.PENDING || appointment.status === AppointmentStatus.SCHEDULED) && onCancel && (
              <Button variant="danger" size="sm" onClick={() => onCancel(appointment.id)} leftIcon={<XCircleIcon className="h-4 w-4"/>}>Cancel</Button>
            )}
            {/* Reschedule might be more complex, involving selecting new time */}
            { (appointment.status === AppointmentStatus.PENDING || appointment.status === AppointmentStatus.SCHEDULED) && onReschedule && (
              <Button variant="warning" size="sm" onClick={() => onReschedule(appointment.id)} leftIcon={<PencilSquareIcon className="h-4 w-4"/>}>Reschedule</Button>
            )}
          </>
        )}
        {userRole === UserRole.DOCTOR && (
          <>
            {appointment.status === AppointmentStatus.PENDING && onApprove && (
              <Button variant="success" size="sm" onClick={() => onApprove(appointment.id)} leftIcon={<CheckCircleIcon className="h-4 w-4"/>}>Approve</Button>
            )}
            {appointment.status === AppointmentStatus.PENDING && onReject && (
              <Button variant="danger" size="sm" onClick={() => onReject(appointment.id)} leftIcon={<XCircleIcon className="h-4 w-4"/>}>Reject</Button>
            )}
             {appointment.status === AppointmentStatus.SCHEDULED && onReschedule && (
              <Button variant="warning" size="sm" onClick={() => onReschedule(appointment.id)} leftIcon={<PencilSquareIcon className="h-4 w-4"/>}>Reschedule</Button>
            )}
            {appointment.status === AppointmentStatus.SCHEDULED && !isPastAppointment && onComplete && (
              <Button variant="secondary" size="sm" onClick={() => onComplete(appointment.id)} leftIcon={<CheckCircleIcon className="h-4 w-4"/>}>Mark Complete</Button>
            )}
            {appointment.status === AppointmentStatus.COMPLETED && onUploadSummary && (
              <Button variant="primary" size="sm" onClick={() => onUploadSummary(appointment.id)} leftIcon={<PencilSquareIcon className="h-4 w-4"/>}>Add Summary/Rx</Button>
            )}
          </>
        )}
      </div>
       {isPastAppointment && <p className="text-xs text-red-500 mt-2 text-right">This appointment date has passed.</p>}
    </Card>
  );
};

export default AppointmentCard;
