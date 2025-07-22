
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Doctor, UserRole, Appointment, AppointmentStatus, Patient } from '../../types';
import { MOCK_USERS, MOCK_APPOINTMENTS, ROUTES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import PageTitle from '../../components/common/PageTitle';
import Card from '../../components/common/Card';
import Input, { Textarea } from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { CalendarDaysIcon, ClockIcon, CurrencyRupeeIcon, DocumentArrowUpIcon, PencilIcon, DocumentIcon } from '@heroicons/react/24/outline'; // Added DocumentIcon

const PatientBookAppointmentPage: React.FC = () => {
  const { id: doctorId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const foundDoctor = MOCK_USERS.find(d => d.id === doctorId && d.role === UserRole.DOCTOR) as Doctor | undefined;
    if (foundDoctor) {
      setDoctor(foundDoctor);
    } else {
      setError('Doctor not found.');
      // navigate(ROUTES.PATIENT_BROWSE_DOCTORS); // Or a 404 page
    }
  }, [doctorId, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || user.role !== UserRole.PATIENT) {
      setError('You must be logged in as a patient to book appointments.');
      return;
    }
    if (!doctor) {
      setError('Doctor details are missing.');
      return;
    }
    if (!appointmentDate || !appointmentTime) {
      setError('Please select a date and time for your appointment.');
      return;
    }
    
    // Validate date and time (basic example)
    const selectedDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (selectedDateTime <= new Date()) {
        setError('Please select a future date and time.');
        return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newAppointment: Appointment = {
        id: `apt${Date.now()}`,
        patientId: user.id,
        patientName: user.fullName,
        doctorId: doctor.id,
        doctorName: doctor.fullName,
        doctorSpecialization: doctor.specialization,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        reason: reason,
        status: AppointmentStatus.PENDING,
        // documents: documents ? Array.from(documents) : undefined, // In real app, upload files and store URLs/references
        createdAt: new Date().toISOString(),
      };
      MOCK_APPOINTMENTS.push(newAppointment); // Add to mock list
      setIsLoading(false);
      setSuccess(`Appointment request sent to ${doctor.fullName} for ${new Date(appointmentDate).toDateString()} at ${appointmentTime}. You will be notified once confirmed.`);
      // Optionally reset form or navigate
      setAppointmentDate('');
      setAppointmentTime('');
      setReason('');
      setDocuments(null);
      // navigate(ROUTES.PATIENT_APPOINTMENTS);
    }, 1000);
  };

  if (error && !doctor) { // Show error prominently if doctor not found
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert type="error" title="Error" message={error} />
      </div>
    );
  }
  
  if (!doctor) {
    return <div className="container mx-auto py-8 px-4 text-center">Loading doctor details...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title={`Book Appointment with ${doctor.fullName}`} subtitle={doctor.specialization} />

      {success && <Alert type="success" title="Success!" message={success} onClose={() => setSuccess('')} className="mb-6" />}
      {error && !success && <Alert type="error" title="Error" message={error} onClose={() => setError('')} className="mb-6" />}


      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card title="Doctor Information">
            <img 
                src={doctor.profilePictureUrl || `https://picsum.photos/seed/${doctor.id}/200/200`}
                alt={doctor.fullName}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-primary object-cover"
            />
            <h3 className="text-xl font-semibold text-center text-brand-text-primary">{doctor.fullName}</h3>
            <p className="text-brand-secondary text-center mb-4">{doctor.specialization}</p>
            <div className="space-y-2 text-sm text-brand-text-secondary">
              <p className="flex items-center"><CalendarDaysIcon className="h-5 w-5 mr-2 text-brand-primary" /> Timings: {doctor.timings}</p>
              <p className="flex items-center"><CurrencyRupeeIcon className="h-5 w-5 mr-2 text-brand-primary" /> Fees: ₹{doctor.fees}</p>
              <p className="flex items-center"><PencilIcon className="h-5 w-5 mr-2 text-brand-primary" /> Experience: {doctor.experience} years</p>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card title="Appointment Details">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Preferred Date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Today onwards
                  required
                />
                <Input
                  label="Preferred Time"
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>
              <Textarea
                label="Reason for Visit (Optional)"
                placeholder="Briefly describe your symptoms or reason for consultation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-brand-text-secondary mb-1">
                  Upload Documents (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary"
                      >
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
                {documents && documents.length > 0 && (
                  <div className="mt-3 py-2 px-3 bg-slate-50 border border-slate-200 rounded-md">
                    <p className="text-sm font-medium text-brand-text-primary mb-1">
                      Selected file{documents.length > 1 ? 's' : ''}:
                    </p>
                    <ul className="list-none pl-0 space-y-1">
                      {Array.from(documents).map((file, index) => (
                        <li key={index} className="text-xs text-brand-text-secondary flex items-center py-0.5" title={file.name}>
                          <DocumentIcon className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
                          <span className="ml-1 text-gray-400 whitespace-nowrap">({ (file.size / 1024).toFixed(1) } KB)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
                Request Appointment
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientBookAppointmentPage;
