import React from 'react';
import Apartment from '../../components/Apartment/Apartment';

import { ApartmentType } from '../Apartments/ApartmentsPage';
import Logo from '../Media/3401Image.png';

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
      <iframe
        id="Apartment3Map"
        title="Apartment3Map"
        width="600"
        height="400"
        src="https://www.mapquest.com/search/result?slug=%2Fus%2Ftexas%2Faustin%2F78705-2615%2F3401-red-river-st-30.292788,-97.725179&query=3401%20Red%20River%20St,%20Austin,%20TX%2078705-2615&page=0&index=0"
      ></iframe>
    </>
  );
};

export default Apartment3;
