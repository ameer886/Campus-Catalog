import React from 'react';
import University from '../../components/University/University';

import { UniversityType } from '../Universities/UniversitiesPage';

export const university1: UniversityType = {
  id: 1,
  schoolName: 'Harvard University',
  city: 'Cambridge',
  state: 'MA',
  zipCode: '02138',
  type: 'Private',
  ranking: 2,
  undergradEnrollment: 5222,
  graduateEnrollment: 13996,
  inStateTuition: 55587,
  outStateTuition: 55587,
  mascot: 'John Harvard, the Pilgrim',
  avgFinancialAid: 49372,
  graduationRate: 0.84,
  acceptanceRate: 0.05,
};

/*
 * Hard-code a university here
 */
const University1: React.FunctionComponent = () => {
  return <University uniQuery={university1} />;
};

export default University1;
