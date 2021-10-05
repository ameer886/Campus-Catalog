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
      <University uniQuery={university3} />)
      <img src={Logo} width="300" alt="Logo" />
      <iframe
        id="PrincetonMap"
        title="PrincetonMap"
        width="600"
        height="400"
        src="https://www.mapquest.com/search/result?slug=%2Fus%2Fnew-jersey%2Fprinceton-university-265770846&query=Princeton%20University&page=0&mqId=265770846&index=0"
      ></iframe>
    </>
  );
};

export default University3;
