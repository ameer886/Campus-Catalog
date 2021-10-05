import React from 'react';
import University from '../../components/University/University';

import { UniversityType } from '../Universities/UniversitiesPage';
import Logo from '../Media/UTAustinLogo.png';

export const university2: UniversityType = {
  id: 2,
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
  return (
    <>
      <University uniQuery={university2} />)
      <img src={Logo} width="300" alt="Logo" />
      <iframe
        id="UTAustinMap"
        title="UTAustinMap"
        width="600"
        height="400"
        src="https://www.mapquest.com/search/result?slug=%2Fus%2Ftexas%2Funiversity-of-texas-at-austin-304265447&query=University%20Of%20Texas%20At%20Austin&page=0&mqId=304265447&index=0"
      ></iframe>
    </>
  );
};

export default University2;
