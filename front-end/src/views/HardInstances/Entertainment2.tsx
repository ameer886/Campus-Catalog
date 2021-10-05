import React from 'react';
import Entertainment from '../../components/Entertainment/Entertainment';
import { EntertainmentType } from '../Entertainments/EntertainmentsPage';
import Logo from '../Media/target.png'

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

const position = {
  lat: 42.3645368543139,
  lng: -71.10267374833074
}

/*
 * Hard-code an entertainment here
 */
const Entertainment2: React.FunctionComponent = () => {
  return <Entertainment entQuery={entertainment2} image={Logo} position={position} />;
};

export default Entertainment2;
