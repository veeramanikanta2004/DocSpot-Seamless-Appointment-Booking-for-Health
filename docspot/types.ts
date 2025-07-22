
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export enum AppointmentStatus {
  PENDING = 'Pending',
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  REJECTED = 'Rejected', // For doctor rejections
}

export enum DoctorApplicationStatus {
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string; // Only for registration/login, not stored in frontend state after login
}

export interface Doctor extends User {
  role: UserRole.DOCTOR;
  specialization: string;
  experience: number; // in years
  fees: number;
  timings: string; // e.g., "09:00-17:00"
  address: string;
  applicationStatus: DoctorApplicationStatus;
  profilePictureUrl?: string;
}

export interface Patient extends User {
  role: UserRole.PATIENT;
}

export interface Admin extends User {
  role: UserRole.ADMIN;
}

export type AuthenticatedUser = Patient | Doctor | Admin;

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string; // denormalized for easy display
  doctorId: string;
  doctorName: string; // denormalized
  doctorSpecialization: string; // denormalized
  appointmentDate: string; // ISO string or a specific format
  appointmentTime: string; // e.g., "10:00 AM"
  reason?: string;
  status: AppointmentStatus;
  documents?: File[]; // For upload, not stored directly in mock data
  visitSummary?: string; // Added by doctor
  prescription?: string; // Added by doctor
  createdAt: string; // ISO string
}

export interface DoctorApplication {
  id: string;
  userId: string; // links to a User who applied
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  fees: number;
  timings: string;
  address: string;
  status: DoctorApplicationStatus;
  submittedAt: string; // ISO string
}
