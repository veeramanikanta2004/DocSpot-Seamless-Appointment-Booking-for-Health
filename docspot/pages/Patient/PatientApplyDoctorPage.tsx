
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorApplication, DoctorApplicationStatus, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_DOCTOR_APPLICATIONS, ROUTES, SPECIALIZATIONS } from '../../constants';
import PageTitle from '../../components/common/PageTitle';
import Card from '../../components/common/Card';
import Input, { Select, Textarea } from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const PatientApplyDoctorPage: React.FC = () => {
  const { user, updateUserDoctorApplicationStatus } = useAuth(); // Assuming updateUser can also create an application
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    specialization: SPECIALIZATIONS[0],
    experience: '',
    fees: '',
    timings: '09:00-17:00',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingApplication, setExistingApplication] = useState<DoctorApplication | null>(null);

  useEffect(() => {
    if (user) {
      const app = MOCK_DOCTOR_APPLICATIONS.find(a => a.userId === user.id);
      if (app) {
        setExistingApplication(app);
      }
      // If user is already a doctor (approved or pending), redirect or show message
      if (user.role === UserRole.DOCTOR) {
        // This page shouldn't be accessible, or should show status.
        // For simplicity, we assume if they are here, they are a patient.
      }
    }
  }, [user]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || user.role !== UserRole.PATIENT) { // Ensure only patients can apply
      setError('Only registered patients can apply to become a doctor.');
      return;
    }
    
    if (!formData.specialization || !formData.experience || !formData.fees || !formData.timings || !formData.address) {
        setError('All fields are required.');
        return;
    }
    if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
        setError('Experience must be a positive number.');
        return;
    }
    if (isNaN(Number(formData.fees)) || Number(formData.fees) < 0) {
        setError('Fees must be a positive number.');
        return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newApplication: DoctorApplication = {
        id: `app${Date.now()}`,
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        specialization: formData.specialization,
        experience: parseInt(formData.experience, 10),
        fees: parseInt(formData.fees, 10),
        timings: formData.timings,
        address: formData.address,
        status: DoctorApplicationStatus.PENDING_APPROVAL,
        submittedAt: new Date().toISOString(),
      };
      MOCK_DOCTOR_APPLICATIONS.push(newApplication);
      // updateUserDoctorApplicationStatus(user.id, DoctorApplicationStatus.PENDING_APPROVAL); // This would also change role
      // For now, this just submits an application. Role change would happen on approval by admin.
      setIsLoading(false);
      setSuccess('Your application to become a doctor has been submitted! You will be notified once it is reviewed by an admin.');
      setExistingApplication(newApplication); // Show status
      // navigate(ROUTES.PATIENT_DASHBOARD); // Or a page showing application status
    }, 1000);
  };

  if (!user) {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }
  
  if (user.role === UserRole.DOCTOR) {
     return (
         <div className="container mx-auto py-8 px-4">
             <PageTitle title="Doctor Application" />
             <Alert type="info" message="You are already registered as a doctor." />
         </div>
     )
  }

  if (existingApplication) {
    return (
      <div className="container mx-auto py-8 px-4">
        <PageTitle title="Doctor Application Status" />
        <Card>
          <p className="text-lg">Your application to become a doctor is currently <strong className={`font-semibold ${existingApplication.status === DoctorApplicationStatus.PENDING_APPROVAL ? 'text-brand-pending' : existingApplication.status === DoctorApplicationStatus.APPROVED ? 'text-brand-approved' : 'text-brand-rejected'}`}>{existingApplication.status}</strong>.</p>
          <p className="text-brand-text-secondary mt-2">Submitted on: {new Date(existingApplication.submittedAt).toLocaleDateString()}</p>
          {existingApplication.status === DoctorApplicationStatus.PENDING_APPROVAL && <p className="mt-4">Please wait while our admin team reviews your application. You will be notified of any updates.</p>}
          {existingApplication.status === DoctorApplicationStatus.APPROVED && <p className="mt-4 text-green-600">Congratulations! Your application has been approved. You can now access doctor functionalities.</p>}
          {existingApplication.status === DoctorApplicationStatus.REJECTED && <p className="mt-4 text-red-600">We regret to inform you that your application has been rejected. Please contact support for more information.</p>}
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="Apply to Become a Doctor" subtitle="Fill in your professional details to join our network of trusted doctors." />
      
      {success && <Alert type="success" title="Success!" message={success} onClose={() => setSuccess('')} className="mb-6" />}
      {error && <Alert type="error" title="Error" message={error} onClose={() => setError('')} className="mb-6" />}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
            <Select label="Specialization" name="specialization" required value={formData.specialization} onChange={handleChange} options={SPECIALIZATIONS.map(s => ({value: s, label:s}))} />
            <Input label="Experience (Years)" name="experience" type="number" required value={formData.experience} onChange={handleChange} min="0" />
            <Input label="Consultation Fees (INR)" name="fees" type="number" required value={formData.fees} onChange={handleChange} min="0"/>
            <Input label="Available Timings (e.g., 09:00-13:00, 14:00-17:00)" name="timings" type="text" required value={formData.timings} onChange={handleChange} placeholder="HH:MM-HH:MM"/>
            <Textarea label="Clinic Address / Main Practice Location" name="address" required value={formData.address} onChange={handleChange} />
            
            <p className="text-sm text-brand-text-secondary">Your personal details (Name: {user.fullName}, Email: {user.email}, Phone: {user.phone}) will be used from your existing patient profile.</p>

            <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
            Submit Application
            </Button>
        </form>
      </Card>
    </div>
  );
};

export default PatientApplyDoctorPage;
