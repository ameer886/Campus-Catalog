import React from 'react';
import University from '../../components/University/University';

import { UniversityType } from '../Universities/UniversitiesPage';

export const university2: UniversityType = {
  schoolName: 'The University of Texas at Austin',
  city: 'Austin',
  state: 'TX',
  zipCode: '78705',
  type: 'Public',
  ranking: 38,
  undergradEnrollment: 40048,
  graduateEnrollment: 10927,
  inStateTuition: 11448,
  outStateTuition: 40032,
  mascot: 'Bevo',
  avgFinancialAid: 10664,
  graduationRate: 0.58,
  acceptanceRate: 0.32,
};

/*
 * Hard-code a university here
 */
const University2: React.FunctionComponent = () => {
  return <University id={2} name="Example University 2" />;
};

export default University2;
