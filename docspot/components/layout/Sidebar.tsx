
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../../types';
import { ROUTES } from '../../constants';
import { 
  Squares2X2Icon, UserGroupIcon, BriefcaseIcon, CalendarDaysIcon, 
  ClipboardDocumentListIcon, ArrowRightOnRectangleIcon, PencilSquareIcon, UserPlusIcon
} from '@heroicons/react/24/outline'; // Changed to outline for sidebar

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  role: UserRole;
}

const patientLinks: SidebarLink[] = [
  { to: ROUTES.PATIENT_BROWSE_DOCTORS, label: 'Browse Doctors', icon: UserGroupIcon },
  { to: ROUTES.PATIENT_APPOINTMENTS, label: 'My Appointments', icon: CalendarDaysIcon },
  { to: ROUTES.PATIENT_APPLY_DOCTOR, label: 'Become a Doctor', icon: BriefcaseIcon },
];

const doctorLinks: SidebarLink[] = [
  { to: ROUTES.DOCTOR_DASHBOARD, label: 'Appointments', icon: CalendarDaysIcon },
  // { to: ROUTES.DOCTOR_PROFILE, label: 'Profile', icon: PencilSquareIcon }, // Future
];

const adminLinks: SidebarLink[] = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Overview', icon: Squares2X2Icon },
  { to: ROUTES.ADMIN_MANAGE_DOCTORS, label: 'Manage Doctors', icon: BriefcaseIcon },
  { to: ROUTES.ADMIN_MANAGE_PATIENTS, label: 'Manage Patients', icon: UserGroupIcon },
  { to: ROUTES.ADMIN_MANAGE_APPOINTMENTS, label: 'All Appointments', icon: ClipboardDocumentListIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  let links: SidebarLink[] = [];
  switch (role) {
    case UserRole.PATIENT:
      links = patientLinks;
      break;
    case UserRole.DOCTOR:
      links = doctorLinks;
      break;
    case UserRole.ADMIN:
      links = adminLinks;
      break;
  }

  return (
    <aside className="w-64 bg-brand-sidebar text-brand-sidebar-text p-4 space-y-2 fixed h-full pt-16 md:pt-0"> {/* Adjusted pt for potential overlap with Navbar */}
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-md hover:bg-slate-600 hover:text-white transition-colors duration-150 ease-in-out ${
                    isActive ? 'bg-brand-secondary text-white font-semibold' : 'text-slate-300'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
