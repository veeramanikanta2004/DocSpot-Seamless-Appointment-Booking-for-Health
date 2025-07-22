
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME, ROUTES, SPECIALIZATIONS } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { UserRole, Doctor, Patient, DoctorApplicationStatus } from '../types';
import Input, { Select, Textarea } from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: UserRole.PATIENT, // Default role
    // Doctor specific fields
    specialization: SPECIALIZATIONS[0],
    experience: '',
    fees: '',
    timings: '09:00-17:00',
    address: '',
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (newRole: UserRole) => {
    setFormData(prev => ({ ...prev, role: newRole }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.role === UserRole.DOCTOR) {
        if (!formData.specialization || !formData.experience || !formData.fees || !formData.timings || !formData.address) {
            setError('All doctor-specific fields are required.');
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
    }


    let userData: Patient | Doctor;
    if (formData.role === UserRole.DOCTOR) {
      userData = {
        id: '', // Will be set by auth service
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: UserRole.DOCTOR,
        specialization: formData.specialization,
        experience: parseInt(formData.experience, 10),
        fees: parseInt(formData.fees, 10),
        timings: formData.timings,
        address: formData.address,
        applicationStatus: DoctorApplicationStatus.PENDING_APPROVAL, // Set by auth service
      };
    } else {
      userData = {
        id: '', // Will be set by auth service
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: UserRole.PATIENT,
      };
    }

    const success = await register(userData, formData.role === UserRole.DOCTOR);
    if (!success) {
      setError('Registration failed. Email might already be in use or server error.');
    }
    // Navigation handled by useAuth
  };

  return (
    <div className="min-h-[calc(100vh-136px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-2xl w-full space-y-8 flex flex-col md:flex-row items-start gap-8">
        <div className="md:w-1/3 hidden md:block mt-16">
             <img src="https://picsum.photos/seed/registerpage/300/450" alt="Patient consulting Doctor" className="rounded-lg shadow-lg"/>
        </div>
        <div className="md:w-2/3 w-full">
            <Card title={`Create your ${APP_NAME} account`} className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <span className="block text-sm font-medium text-brand-text-secondary mb-1">Register as:</span>
                    <div className="flex space-x-4">
                        <Button type="button" onClick={() => handleRoleChange(UserRole.PATIENT)} variant={formData.role === UserRole.PATIENT ? 'primary' : 'secondary'} className={formData.role !== UserRole.PATIENT ? '!bg-slate-300 !text-slate-700 hover:!bg-slate-400' : ''}>Patient</Button>
                        <Button type="button" onClick={() => handleRoleChange(UserRole.DOCTOR)} variant={formData.role === UserRole.DOCTOR ? 'primary' : 'secondary'} className={formData.role !== UserRole.DOCTOR ? '!bg-slate-300 !text-slate-700 hover:!bg-slate-400' : ''}>Doctor</Button>
                    </div>
                </div>

                <Input label="Full Name" name="fullName" type="text" required value={formData.fullName} onChange={handleChange} />
                <Input label="Email" name="email" type="email" required value={formData.email} onChange={handleChange} />
                <Input label="Phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} />
                <Input label="Password" name="password" type="password" required value={formData.password} onChange={handleChange} />
                <Input label="Confirm Password" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />

                {formData.role === UserRole.DOCTOR && (
                <>
                    <h3 className="text-lg font-semibold text-brand-text-primary pt-2 border-t mt-4">Doctor Details</h3>
                    <Select label="Specialization" name="specialization" required value={formData.specialization} onChange={handleChange} options={SPECIALIZATIONS.map(s => ({value: s, label:s}))} />
                    <Input label="Experience (Years)" name="experience" type="number" required value={formData.experience} onChange={handleChange} min="0" />
                    <Input label="Consultation Fees (INR)" name="fees" type="number" required value={formData.fees} onChange={handleChange} min="0"/>
                    <Input label="Timings (e.g., 09:00-13:00, 14:00-17:00)" name="timings" type="text" required value={formData.timings} onChange={handleChange} placeholder="HH:MM-HH:MM"/>
                    <Textarea label="Clinic Address" name="address" required value={formData.address} onChange={handleChange} />
                </>
                )}

                {error && <p className="text-sm text-red-600 py-2">{error}</p>}
                <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
                Register
                </Button>
            </form>
            <p className="mt-6 text-center text-sm text-brand-text-secondary">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="font-medium text-brand-primary hover:text-brand-primary-dark">
                Login here
                </Link>
            </p>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
