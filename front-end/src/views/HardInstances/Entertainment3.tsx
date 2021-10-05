import React from 'react';
import Entertainment from '../../components/Entertainment/Entertainment';
import { EntertainmentType } from '../Entertainments/EntertainmentsPage';
import Logo from '../Media/lan_ramen.webp';

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

const position = {
  lat: 40.35115305373854,
  lng: -74.66067731706964,
};

/*
 * Hard-code an entertainment here
 */
const Entertainment3: React.FunctionComponent = () => {
  return (
    <Entertainment
      entQuery={entertainment3}
      image={Logo}
      position={position}
    />
  );
};

export default Entertainment3;
