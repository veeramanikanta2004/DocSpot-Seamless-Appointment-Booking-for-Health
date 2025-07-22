
import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/common/PageTitle';
import Card from '../../components/common/Card';
import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_DOCTOR_APPLICATIONS } from '../../constants';
import { UserRole, DoctorApplicationStatus } from '../../types';
import { UserGroupIcon, BriefcaseIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingDoctorApplications: 0,
  });

  useEffect(() => {
    // Simulate fetching data
    const patients = MOCK_USERS.filter(u => u.role === UserRole.PATIENT).length;
    const doctors = MOCK_USERS.filter(u => u.role === UserRole.DOCTOR && (u as any).applicationStatus === DoctorApplicationStatus.APPROVED).length;
    const appointments = MOCK_APPOINTMENTS.length;
    const pendingApps = MOCK_DOCTOR_APPLICATIONS.filter(app => app.status === DoctorApplicationStatus.PENDING_APPROVAL).length;
    
    setStats({
      totalPatients: patients,
      totalDoctors: doctors,
      totalAppointments: appointments,
      pendingDoctorApplications: pendingApps,
    });
  }, []);

  const statCards = [
    { title: 'Total Patients', value: stats.totalPatients, icon: UserGroupIcon, color: 'bg-blue-500', link: ROUTES.ADMIN_MANAGE_PATIENTS },
    { title: 'Active Doctors', value: stats.totalDoctors, icon: BriefcaseIcon, color: 'bg-green-500', link: ROUTES.ADMIN_MANAGE_DOCTORS },
    { title: 'Total Appointments', value: stats.totalAppointments, icon: CalendarDaysIcon, color: 'bg-purple-500', link: ROUTES.ADMIN_MANAGE_APPOINTMENTS },
    { title: 'Pending Applications', value: stats.pendingDoctorApplications, icon: ClockIcon, color: 'bg-yellow-500', link: ROUTES.ADMIN_MANAGE_DOCTORS },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="Admin Dashboard" subtitle="Overview of the DocSpot platform." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(stat => (
          <Link to={stat.link} key={stat.title}>
            <Card className={`${stat.color} text-white hover:opacity-90 transition-opacity`}>
              <div className="flex items-center">
                <stat.icon className="h-10 w-10 mr-4" />
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm">{stat.title}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="space-y-3">
            <Link to={ROUTES.ADMIN_MANAGE_DOCTORS} className="block w-full">
                <button className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Manage Doctor Applications</button>
            </Link>
            <Link to={ROUTES.ADMIN_MANAGE_APPOINTMENTS} className="block w-full">
                <button className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">View All Appointments</button>
            </Link>
            <Link to={ROUTES.ADMIN_MANAGE_PATIENTS} className="block w-full">
                <button className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">View All Patients</button>
            </Link>
          </div>
        </Card>
        <Card title="System Health (Placeholder)">
          <p className="text-brand-text-secondary">System status: <span className="text-green-500 font-semibold">Operational</span></p>
          <p className="text-brand-text-secondary mt-2">Last check: {new Date().toLocaleString()}</p>
          {/* More system health info can go here */}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
