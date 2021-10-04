import React from 'react';
import Apartment from '../../components/Apartment/Apartment';

import { ApartmentType } from '../Apartments/ApartmentsPage';
import Logo from '../Media/3401Image.jpeg';

export const apartment3: ApartmentType = {
  id: 3,
  propertyName: '3401 at Red River',
  location: [
    '3401 Red River Austin TX 78705',
    'Austin',
    'Texas',
    '78705',
  ],
  minRent: 1199,
  maxRent: 1799,
  beds: 'Studio - 2',
  baths: '1',
  sqft: '389 - 920 sqft',
  petFriendly: 'true',
  schools: [
    'Harvard University',
    'Princeton University',
    'The University of Texas at Austin',
  ],
  amenities: [
    'Pool',
    'Fitness Center',
    'Pet Play Area',
    'Cabana',
    'Courtyard',
    'Shuttle To Campus',
  ],
  rating: 6.9,
  walkScore: 80,
  transitScore: 62,
};

/*
 * Hard-code a university here
 */
const Apartment3: React.FunctionComponent = () => {
  return (
    <>
      <Apartment aptQuery={apartment3} />
      ;)
      <img src={Logo} width="300" alt="Logo" />
    </>
  );
};

export default Apartment3;
