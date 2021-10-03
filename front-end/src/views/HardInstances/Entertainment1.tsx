import React from 'react';
import Entertainment from '../../components/Entertainment/Entertainment';

import { EntertainmentType } from '../Entertainments/EntertainmentsPage';

export const entertainment1: EntertainmentType = {
  id: 1,
  businessName: 'Mozarts Coffee Roasters',
  reviewCount: 1521,
  category: 'Coffee & Tea',
  rating: 4.0,
  location: ['3825 Lake Austin Blvd', 'Austin', 'TX', '78703'],
  ageRestriction: 0,
  price: '$$',
  delivery: 'true',
};

/*
 * Hard-code an entertainment here
 */
const Entertainment1: React.FunctionComponent = () => {
  return <Entertainment entQuery={entertainment1} />;
};

export default Entertainment1;
