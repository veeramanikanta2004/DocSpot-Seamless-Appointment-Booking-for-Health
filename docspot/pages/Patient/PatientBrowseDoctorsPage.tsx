
import React, { useState, useEffect, useMemo } from 'react';
import { Doctor, UserRole, DoctorApplicationStatus } from '../../types';
import { MOCK_USERS, SPECIALIZATIONS } from '../../constants';
import DoctorCard from '../../components/Doctor/DoctorCard';
import PageTitle from '../../components/common/PageTitle';
import Input, { Select } from '../../components/common/Input';

const PatientBrowseDoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  // Add filters for location and availability if needed in future

  useEffect(() => {
    // Simulate API call to fetch doctors
    const fetchedDoctors = MOCK_USERS.filter(
      (user) => user.role === UserRole.DOCTOR && (user as Doctor).applicationStatus === DoctorApplicationStatus.APPROVED
    ) as Doctor[];
    setDoctors(fetchedDoctors);
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const nameMatch = doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const specialtyMatch = selectedSpecialty ? doctor.specialization === selectedSpecialty : true;
      // const locationMatch = selectedLocation ? doctor.address.toLowerCase().includes(selectedLocation.toLowerCase()) : true;
      return nameMatch && specialtyMatch;
    });
  }, [doctors, searchTerm, selectedSpecialty]);

  const specialtyOptions = [{ value: '', label: 'All Specialties' }, ...SPECIALIZATIONS.map(s => ({ value: s, label: s }))];

  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="Find Your Doctor" subtitle="Browse specialists and book your appointment." />
      
      <div className="mb-8 p-4 bg-brand-surface rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Search by doctor's name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Search Name"
        />
        <Select
          label="Filter by Specialty"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          options={specialtyOptions}
        />
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6"> {/* Changed to 1 column for better card display */}
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <img src="https://picsum.photos/seed/noresults/200/200" alt="No doctors found" className="mx-auto mb-4 rounded-lg w-48 h-48" />
          <p className="text-xl text-brand-text-secondary">No doctors found matching your criteria.</p>
          <p className="text-brand-text-secondary">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default PatientBrowseDoctorsPage;
