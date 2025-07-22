
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, ROUTES, MOCK_USERS } from '../constants';
import { UserRole, Doctor, DoctorApplicationStatus } from '../types'; // Added DoctorApplicationStatus
import Button from '../components/common/Button';

const LandingPage: React.FC = () => {
  const doctors = MOCK_USERS.filter(user => user.role === UserRole.DOCTOR && (user as Doctor).applicationStatus === DoctorApplicationStatus.APPROVED).slice(0, 3) as Doctor[];

  return (
    <div className="bg-slate-100">
      {/* Hero Section */}
      <section className="bg-brand-background py-20 px-4 md:px-0">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-5xl font-bold text-brand-text-primary mb-6">
              Effortlessly schedule your doctor
            </h1>
            <p className="text-xl text-brand-text-secondary mb-8">
              appointments with just a few clicks, putting your health in your hands.
            </p>
            <Link to={ROUTES.PATIENT_BROWSE_DOCTORS}>
              <Button size="lg" variant="primary">
                Book your Doctor
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Placeholder for hero image - using a simple one */}
            <img 
              src="https://picsum.photos/seed/landingpage/600/400" 
              alt="Happy Doctors" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      {doctors.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-brand-text-primary mb-12">Meet Our Doctors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => {
                const doctorBookingPagePath = ROUTES.PATIENT_BOOK_APPOINTMENT.replace(':doctorId', doctor.id);
                return (
                  <div key={doctor.id} className="bg-brand-surface rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src={doctor.profilePictureUrl || `https://picsum.photos/seed/${doctor.id}/150/150`} 
                      alt={doctor.fullName} 
                      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-primary object-cover"
                    />
                    <h3 className="text-xl font-semibold text-brand-text-primary mb-1">{doctor.fullName}</h3>
                    <p className="text-brand-secondary">{doctor.specialization}</p>
                    <p className="text-sm text-brand-text-secondary mt-1 mb-3">
                      {doctor.experience} {doctor.experience === 1 ? 'year' : 'years'} of experience
                    </p>
                    <Link 
                      to={doctorBookingPagePath} 
                      className="mt-4 inline-block"
                      aria-label={`View profile and book an appointment with ${doctor.fullName}`}
                    >
                       <Button variant="secondary" size="sm">View Profile & Book</Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How it Works Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-brand-text-primary mb-12">How {APP_NAME} Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="bg-brand-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Find a Doctor</h3>
              <p className="text-brand-text-secondary">Search by specialty, location, or name. Read profiles and reviews.</p>
            </div>
            <div className="p-6">
              <div className="bg-brand-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Book Appointment</h3>
              <p className="text-brand-text-secondary">Choose a convenient date and time. Upload any necessary documents securely.</p>
            </div>
            <div className="p-6">
              <div className="bg-brand-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Get Care</h3>
              <p className="text-brand-text-secondary">Visit your doctor, get diagnosis, and receive follow-up care instructions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
