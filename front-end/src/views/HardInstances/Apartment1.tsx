import React from 'react';
import Apartment from '../../components/Apartment/Apartment';

import { ApartmentType } from '../Apartments/ApartmentsPage';
import Logo from '../Media/ParksidePlaceImage.png';

export const apartment1: ApartmentType = {
  id: 1,
  propertyName: 'Parkside Place',
  location: [
    '700 Huron Ave Cambridge MA 02138',
    'Cambridge',
    'Massachusetts',
    '02138',
  ],
  minRent: 2461,
  maxRent: 3979,
  beds: '1 - 3',
  baths: '1 - 1.5',
  sqft: '580 - 1,100 sqft',
  petFriendly: 'true',
  schools: [
    'Harvard University',
    'Princeton University',
    'The University of Texas at Austin',
  ],
  amenities: [
    'Concierge',
    'Fitness Center',
    'Playground',
    'Clubhouse',
  ],
  rating: 9.4,
  walkScore: 66,
  transitScore: 46,
};

/*
 * Hard-code a university here
 */
const Apartment1: React.FunctionComponent = () => {
  return (
    <>
      <Apartment aptQuery={apartment1} />
      
      <img src={Logo} width="300" alt="Logo" />
      <iframe id="HarvardMap"
    title="HarvardMap"
    width="600"
    height="400"
    src="https://www.mapquest.com/search/result?slug=%2Fus%2Fmassachusetts%2Fcambridge%2F02138-4586%2F700-huron-ave-42.380934,-71.154215&query=700%20Huron%20Ave,%20Cambridge,%20MA%2002138-4586&page=0&index=0">
</iframe>      
    </>
  );
};

export default Apartment1;
