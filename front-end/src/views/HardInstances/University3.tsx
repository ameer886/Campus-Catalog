import React from 'react';
import University from '../../components/University/University';

import { UniversityType } from '../Universities/UniversitiesPage';
import Logo from '../Media/PrincetonLogo.png';

export const university3: UniversityType = {
  id: 3,
  schoolName: 'Princeton University',
  city: 'Princeton',
  state: 'NJ',
  zipCode: '08544',
  type: 'Private',
  ranking: 1,
  undergradEnrollment: 4773,
  graduateEnrollment: 3079,
  inStateTuition: 56010,
  outStateTuition: 56010,
  mascot: 'The Tiger',
  avgFinancialAid: 52670,
  graduationRate: 0.58,
  acceptanceRate: 0.89,
};

/*
 * Hard-code a university here
 */
const University3: React.FunctionComponent = () => {
  return (
    <>
      <University uniQuery={university3}/>)
      <img src={Logo} width = "300" alt="Logo"/>
    </>)
};

export default University3;
