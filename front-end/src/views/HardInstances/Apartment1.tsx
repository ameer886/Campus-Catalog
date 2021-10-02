import React from 'react';
import Apartment from '../../components/Apartment/Apartment';

import { ApartmentsType } from '../Apartments/ApartmentsPage';

export const apartment1: ApartmentsType = {
  id: 1,
  propertyName: 'Parkside Place',
  location: ['700 Huron Ave Cambridge MA 02138', 'Cambridge', 'Massachusetts', '02138'],
  minRent: 2461,
  maxRent: 3979,
  beds: '1 - 3',
  baths: '1 - 1.5',
  sqft: '580 - 1,100 sqft',
  petFriendly: true,
  schools: ['Harvard University','Massachusetts Institute of Technology','Boston University'],
  amenities: ['Concierge','Fitness Center','Playground','Clubhouse'],
  rating: 9.4,
  walkScore: 66,
  transitScore:46,
};

/*
 * Hard-code a university here
 */
const Apartment1: React.FunctionComponent = () => {
  return <Apartment aptQuery={apartment1} />;
};

export default Apartment1;

