import React from 'react';
import Entertainment from '../../components/Entertainment/Entertainment';

import { EntertainmentType } from '../Entertainments/EntertainmentsPage';

export const entertainment3: EntertainmentType = {
  id: 3,
  businessName: 'Lan Ramen',
  reviewCount: 282,
  category: 'Chinese',
  rating: 4.0,
  location: ['4 Hulfish St', 'Princeton', 'NJ', '08542'],
  ageRestriction: 0,
  price: '$$',
  delivery: 'true',
};

/*
 * Hard-code a university here
 */
const Entertainment3: React.FunctionComponent = () => {
  return <Entertainment entQuery={entertainment3} />;
};

export default Entertainment3;
