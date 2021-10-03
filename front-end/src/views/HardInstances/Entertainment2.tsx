import React from 'react';
import Entertainment from '../../components/Entertainment/Entertainment';

import { EntertainmentType } from '../Entertainments/EntertainmentsPage';

export const entertainment2: EntertainmentType = {
  id: 2,
  businessName: 'Target',
  reviewCount: 33,
  category: 'Department Stores',
  rating: 2.0,
  location: ['564 Massachusetts Ave', 'Cambridge', 'MA', '02139'],
  ageRestriction: 0,
  price: '$$',
  delivery: undefined,
};

/*
 * Hard-code a university here
 */
const Entertainment2: React.FunctionComponent = () => {
  return <Entertainment entQuery={entertainment2} />;
};

export default Entertainment2;
