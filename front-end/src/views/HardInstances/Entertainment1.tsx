import React from 'react';
import Entertainment from '../../components/Entertainment/Entertainment';
import Logo from '../Media/Mozarts.png'
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

const position = {
  lat: 30.295588200238317,
  lng: -97.78417627312469
}
/*
 * Hard-code an entertainment here
 */
const Entertainment1: React.FunctionComponent = () => {
  return (
  <>
    <Entertainment entQuery={entertainment1} image={Logo} position={position} />
    
    
  </>
  )};

export default Entertainment1;
