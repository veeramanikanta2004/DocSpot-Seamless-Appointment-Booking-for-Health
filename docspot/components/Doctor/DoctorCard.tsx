
import React from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../../types';
import { ROUTES } from '../../constants';
import Card from '../common/Card';
import Button from '../common/Button';
import { MapPinIcon, CurrencyRupeeIcon, ClockIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const bookAppointmentLink = ROUTES.PATIENT_BOOK_APPOINTMENT.replace(':doctorId', doctor.id);
  
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={doctor.profilePictureUrl || `https://picsum.photos/seed/${doctor.id}/120/120`}
          alt={doctor.fullName}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-brand-primary object-cover"
        />
        <div className="flex-grow text-center sm:text-left">
          <h2 className="text-2xl font-bold text-brand-text-primary">{doctor.fullName}</h2>
          <p className="text-brand-secondary font-semibold text-lg">{doctor.specialization}</p>
          <div className="mt-2 space-y-1 text-sm text-brand-text-secondary">
            <p className="flex items-center justify-center sm:justify-start"><BriefcaseIcon className="h-4 w-4 mr-2 text-brand-primary" /> {doctor.experience} Yrs Experience</p>
            <p className="flex items-center justify-center sm:justify-start"><MapPinIcon className="h-4 w-4 mr-2 text-brand-primary" /> {doctor.address}</p>
            <p className="flex items-center justify-center sm:justify-start"><CurrencyRupeeIcon className="h-4 w-4 mr-2 text-brand-primary" /> {doctor.fees}</p>
            <p className="flex items-center justify-center sm:justify-start"><ClockIcon className="h-4 w-4 mr-2 text-brand-primary" /> {doctor.timings}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center sm:text-right">
        <Link to={bookAppointmentLink}>
          <Button variant="primary">
            Book Now
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default DoctorCard;
