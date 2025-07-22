
import { UserRole, Doctor, Appointment, AppointmentStatus, DoctorApplicationStatus, Patient, Admin, DoctorApplication } from './types';

export const APP_NAME = "DocSpot";

export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_BROWSE_DOCTORS: '/patient/doctors',
  PATIENT_BOOK_APPOINTMENT: '/patient/book/:doctorId',
  PATIENT_APPOINTMENTS: '/patient/appointments',
  PATIENT_APPLY_DOCTOR: '/patient/apply-doctor',
  DOCTOR_DASHBOARD: '/doctor/dashboard', // Manage appointments
  DOCTOR_PROFILE: '/doctor/profile', // View/Edit profile
  DOCTOR_REGISTRATION_PENDING: '/doctor/pending-approval',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MANAGE_DOCTORS: '/admin/doctors', // Approve/reject, view doctors
  ADMIN_MANAGE_PATIENTS: '/admin/patients',
  ADMIN_MANAGE_APPOINTMENTS: '/admin/appointments',
  NOT_FOUND: '/404',
};

// Mock Data
export const MOCK_USERS: (Patient | Doctor | Admin)[] = [
  { id: 'admin001', fullName: 'Admin User', email: 'admin@docspot.com', phone: '0000000000', role: UserRole.ADMIN, password: 'password' },
  { id: 'patient001', fullName: 'Alice Wonderland', email: 'alice@patient.com', phone: '1112223333', role: UserRole.PATIENT, password: 'password' },
  { id: 'patient002', fullName: 'Bob The Builder', email: 'bob@patient.com', phone: '4445556666', role: UserRole.PATIENT, password: 'password' },
  { 
    id: 'doctor001', fullName: 'Dr. Eve Soul', email: 'eve@doctor.com', phone: '7778889999', role: UserRole.DOCTOR, 
    specialization: 'Cardiology', experience: 10, fees: 1500, timings: '10:00-18:00', address: '123 Heart St, Cardio City', 
    applicationStatus: DoctorApplicationStatus.APPROVED, password: 'password', profilePictureUrl: 'https://picsum.photos/seed/doctor001/200/200'
  },
  { 
    id: 'doctor002', fullName: 'Dr. Adam Smith', email: 'adam@doctor.com', phone: '0101010101', role: UserRole.DOCTOR, 
    specialization: 'Pediatrics', experience: 5, fees: 1000, timings: '09:00-17:00', address: '456 Child Ave, Kidsville', 
    applicationStatus: DoctorApplicationStatus.APPROVED, password: 'password', profilePictureUrl: 'https://picsum.photos/seed/doctor002/200/200'
  },
  { 
    id: 'doctor003', fullName: 'Dr. Carol Danvers', email: 'carol@doctor.com', phone: '0202020202', role: UserRole.DOCTOR, 
    specialization: 'Neurology', experience: 12, fees: 2000, timings: '11:00-19:00', address: '789 Brain Rd, Neuroburg', 
    applicationStatus: DoctorApplicationStatus.APPROVED, password: 'password', profilePictureUrl: 'https://picsum.photos/seed/doctor003/200/200'
  },
  { 
    id: 'doctor004pending', fullName: 'Dr. Pending App', email: 'pending@doctor.com', phone: '0303030303', role: UserRole.DOCTOR, 
    specialization: 'Dermatology', experience: 3, fees: 800, timings: '10:00-16:00', address: 'Pending Address', 
    applicationStatus: DoctorApplicationStatus.PENDING_APPROVAL, password: 'password'
  },
];

export const MOCK_DOCTOR_APPLICATIONS: DoctorApplication[] = [
  {
    id: 'app001', userId: 'doctor004pending', fullName: 'Dr. Pending App', email: 'pending@doctor.com', phone: '0303030303',
    specialization: 'Dermatology', experience: 3, fees: 800, timings: '10:00-16:00', address: 'Pending Address',
    status: DoctorApplicationStatus.PENDING_APPROVAL, submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'app002', userId: 'tempUser001', fullName: 'Dr. Wannabe Great', email: 'wannabe@example.com', phone: '0404040404',
    specialization: 'General Medicine', experience: 1, fees: 500, timings: '09:00-13:00', address: 'Applicant Street',
    status: DoctorApplicationStatus.PENDING_APPROVAL, submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  }
];


export const MOCK_APPOINTMENTS: Appointment[] = [
  { 
    id: 'apt001', patientId: 'patient001', patientName: 'Alice Wonderland', doctorId: 'doctor001', doctorName: 'Dr. Eve Soul', doctorSpecialization: 'Cardiology',
    appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], appointmentTime: '11:00', 
    reason: 'Regular checkup', status: AppointmentStatus.SCHEDULED, createdAt: new Date().toISOString() 
  },
  { 
    id: 'apt002', patientId: 'patient002', patientName: 'Bob The Builder', doctorId: 'doctor002', doctorName: 'Dr. Adam Smith', doctorSpecialization: 'Pediatrics',
    appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], appointmentTime: '14:30', 
    reason: 'Vaccination', status: AppointmentStatus.PENDING, createdAt: new Date().toISOString()
  },
  { 
    id: 'apt003', patientId: 'patient001', patientName: 'Alice Wonderland', doctorId: 'doctor003', doctorName: 'Dr. Carol Danvers', doctorSpecialization: 'Neurology',
    appointmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], appointmentTime: '10:00', 
    reason: 'Headache follow-up', status: AppointmentStatus.COMPLETED, visitSummary: 'Patient is recovering well. Advised rest.', prescription: 'None.', createdAt: new Date().toISOString()
  },
   { 
    id: 'apt004', patientId: 'patient002', patientName: 'Bob The Builder', doctorId: 'doctor001', doctorName: 'Dr. Eve Soul', doctorSpecialization: 'Cardiology',
    appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], appointmentTime: '16:00', 
    reason: 'Chest pain query', status: AppointmentStatus.PENDING, createdAt: new Date().toISOString() 
  },
];

export const SPECIALIZATIONS = [
  "Cardiology", "Pediatrics", "Neurology", "Dermatology", "Oncology", "Orthopedics", "General Medicine", "ENT", "Ophthalmology", "Psychiatry"
];
