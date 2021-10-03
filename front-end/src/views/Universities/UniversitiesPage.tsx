import React from 'react';
import './UniversitiesPage.css';

import UniversityTable from '../../components/UniversityTable/UniversityTable';
import UniversityGrid from '../../components/UniversityGrid/UniversityGrid';

import { university1 } from '../HardInstances/University1';
import { university2 } from '../HardInstances/University2';
import { university3 } from '../HardInstances/University3';

export type UniversityType = {
  id: number;
  schoolName: string;
  city?: string;
  state?: string;
  zipCode?: string;
  type?: 'Public' | 'Private';
  ranking?: number;
  undergradEnrollment?: number;
  graduateEnrollment?: number;
  inStateTuition?: number;
  outStateTuition?: number;
  mascot?: string;
  avgFinancialAid?: number;
  graduationRate?: number;
  acceptanceRate?: number;
};

/*
 * The Universities page
 * One of the three main model collection pages
 * Should contain a list of universities in a sortable table/grid
 */
const UniversitiesPage: React.FunctionComponent = () => {
  return (
    <div className="Universities">
      <h1>Universities</h1>
      <UniversityTable
        rows={[university1, university2, university3]}
      />
      <UniversityGrid
        cards={[university1, university2, university3]}
      />
    </div>
  );
};

export default UniversitiesPage;
