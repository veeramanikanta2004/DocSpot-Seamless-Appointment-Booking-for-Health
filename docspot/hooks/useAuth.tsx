
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthenticatedUser, UserRole, Doctor, DoctorApplicationStatus, Patient } from '../types';
import { MOCK_USERS } from '../constants'; // Using mock users for simulation
import { useNavigate } from 'react-router-dom'; 
import { ROUTES } from '../constants';


interface AuthContextType {
  user: AuthenticatedUser | null;
  医生申请状态?: DoctorApplicationStatus; 
  login: (email: string, password_raw: string, redirectPath?: string | null) => Promise<boolean>; // Added redirectPath
  logout: () => void;
  register: (userData: AuthenticatedUser, isDoctor: boolean) => Promise<boolean>;
  updateUserDoctorApplicationStatus: (userId: string, status: DoctorApplicationStatus) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [医生申请状态, setDoctorApplicationStatus] = useState<DoctorApplicationStatus | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    const storedStatus = localStorage.getItem('doctorAppStatus');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as AuthenticatedUser;
      setUser(parsedUser);
      if (parsedUser.role === UserRole.DOCTOR) {
        setDoctorApplicationStatus((parsedUser as Doctor).applicationStatus || (storedStatus as DoctorApplicationStatus));
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password_raw: string, redirectPath?: string | null): Promise<boolean> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password_raw);
        if (foundUser) {
          const authUser = { ...foundUser };
          delete authUser.password; 
          setUser(authUser as AuthenticatedUser);
          localStorage.setItem('authUser', JSON.stringify(authUser));
          
          if (redirectPath) {
            navigate(redirectPath);
          } else {
            // Default navigation logic if no redirectPath is provided
            if (authUser.role === UserRole.DOCTOR) {
              const doctorUser = authUser as Doctor;
              setDoctorApplicationStatus(doctorUser.applicationStatus);
              localStorage.setItem('doctorAppStatus', doctorUser.applicationStatus);
              if (doctorUser.applicationStatus === DoctorApplicationStatus.PENDING_APPROVAL) {
                navigate(ROUTES.DOCTOR_REGISTRATION_PENDING);
              } else if (doctorUser.applicationStatus === DoctorApplicationStatus.APPROVED) {
                navigate(ROUTES.DOCTOR_DASHBOARD);
              } else { // Rejected or other states
                 navigate(ROUTES.LOGIN); // Or a specific page for rejected doctors
              }
            } else if (authUser.role === UserRole.PATIENT) {
              navigate(ROUTES.PATIENT_BROWSE_DOCTORS);
            } else if (authUser.role === UserRole.ADMIN) {
              navigate(ROUTES.ADMIN_DASHBOARD);
            } else {
              navigate(ROUTES.LANDING); // Fallback
            }
          }
          resolve(true);
        } else {
          resolve(false);
        }
        setIsLoading(false);
      }, 500);
    });
  }, [navigate]);

  const register = useCallback(async (userData: AuthenticatedUser, isDoctor: boolean): Promise<boolean> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUser = MOCK_USERS.find(u => u.email === userData.email);
        if (existingUser) {
          setIsLoading(false);
          resolve(false); 
          return;
        }
        
        let newUser: AuthenticatedUser;
        if (isDoctor) {
          newUser = { 
            ...userData, 
            id: `user${Date.now()}`,
            role: UserRole.DOCTOR,
            applicationStatus: DoctorApplicationStatus.PENDING_APPROVAL,
           } as Doctor;
        } else {
          newUser = { 
            ...userData, 
            id: `user${Date.now()}`,
            role: UserRole.PATIENT,
           } as Patient;
        }
        
        MOCK_USERS.push(newUser); 
        
        const authUser = { ...newUser };
        delete authUser.password;
        setUser(authUser as AuthenticatedUser);
        localStorage.setItem('authUser', JSON.stringify(authUser));
        
        if (authUser.role === UserRole.DOCTOR) {
            setDoctorApplicationStatus(DoctorApplicationStatus.PENDING_APPROVAL);
            localStorage.setItem('doctorAppStatus', DoctorApplicationStatus.PENDING_APPROVAL);
            navigate(ROUTES.DOCTOR_REGISTRATION_PENDING);
        } else {
            navigate(ROUTES.PATIENT_BROWSE_DOCTORS);
        }
        setIsLoading(false);
        resolve(true);
      }, 500);
    });
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setDoctorApplicationStatus(undefined);
    localStorage.removeItem('authUser');
    localStorage.removeItem('doctorAppStatus');
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const updateUserDoctorApplicationStatus = useCallback((userId: string, status: DoctorApplicationStatus) => {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId); // User might be patient applying
    if (userIndex > -1) {
      const targetUser = MOCK_USERS[userIndex];
      // If user was a patient and now approved as doctor, update details from application.
      // This part is simplified; in a real app, you'd fetch application details.
      if (targetUser.role === UserRole.PATIENT && status === DoctorApplicationStatus.APPROVED) {
         // This is a placeholder. Realistically, an application object would supply these details.
         // For now, if a patient is approved, they need to be "converted" to a Doctor type.
         // This mock doesn't fully handle the data transformation from Patient to Doctor on approval here.
         // The AdminManageDoctorsPage handles creating the full Doctor object.
      }


      if (targetUser.role === UserRole.DOCTOR) {
         (MOCK_USERS[userIndex] as Doctor).applicationStatus = status;
      }
      
      if (user && user.id === userId) { // If the updated user is the currently logged-in user
        // Update the user object in state, especially if role or applicationStatus changes.
        const updatedUserFromMock = MOCK_USERS[userIndex];
        setUser(updatedUserFromMock as AuthenticatedUser); // Update with potentially new role/status
        
        if (updatedUserFromMock.role === UserRole.DOCTOR) {
            setDoctorApplicationStatus((updatedUserFromMock as Doctor).applicationStatus);
            localStorage.setItem('doctorAppStatus', (updatedUserFromMock as Doctor).applicationStatus);
            if ((updatedUserFromMock as Doctor).applicationStatus === DoctorApplicationStatus.APPROVED && window.location.hash.endsWith(ROUTES.DOCTOR_REGISTRATION_PENDING.substring(1))) {
               navigate(ROUTES.DOCTOR_DASHBOARD);
            }
        }
      }
    }
  }, [user, navigate]);


  return (
    <AuthContext.Provider value={{ user, 医生申请状态, login, logout, register, updateUserDoctorApplicationStatus, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
