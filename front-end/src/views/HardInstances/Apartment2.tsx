import React from 'react';
import Apartment from '../../components/Apartment/Apartment';

import { ApartmentType } from '../Apartments/ApartmentsPage';
import Logo from '../Media/BarclaySquareImage.jpeg';

export const apartment2: ApartmentType = {
  id: 2,
  propertyName: 'Barclay Square at Princeton Forrestal',
  location: [
    '1900 Barclay Blvd Princeton NJ 08540',
    'Princeton',
    'New Jersey',
    '08540',
  ],
  minRent: 2815,
  maxRent: 4690,
  beds: '2 - 3',
  baths: '2 - 3',
  sqft: '1,268 - 2,966 sqft',
  petFriendly: 'true',
  schools: [
    'Harvard University',
    'Princeton University',
    'The University of Texas at Austin',
  ],
  amenities: [
    'Pool',
    'Sauna',
    'Gameroom',
    'Grill',
    'Basketball Court',
    'Concierge',
    'Fitness Center',
    'Playground',
    'Clubhouse',
  ],
  rating: undefined,
  walkScore: 18,
  transitScore: 0,
};

/*
 * Hard-code a university here
 */
const Apartment2: React.FunctionComponent = () => {
  return (
    <>
      <Apartment aptQuery={apartment2} />
      ;)
      <img src={Logo} width="300" alt="Logo" />
      <iframe id="HarvardMap"
    title="HarvardMap"
    width="600"
    height="400"
    src="https://www.mapquest.com/search/result?slug=%2Fus%2Fnew-jersey%2Fprinceton%2F08540-5892%2F1900-barclay-blvd-40.360291,-74.620058&query=1900%20Barclay%20Blvd,%20Princeton,%20NJ%2008540-5892&page=0&index=0">
</iframe>      
    </>
  );
};

export default Apartment2;
