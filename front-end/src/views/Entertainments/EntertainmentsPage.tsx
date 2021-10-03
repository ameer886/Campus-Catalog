import React from 'react';
import './EntertainmentsPage.css';

import EntertainmentTable from '../../components/EntertainmentTable/EntertainmentTable';

import { entertainment1 } from '../HardInstances/Entertainment1';
import { entertainment2 } from '../HardInstances/Entertainment2';
import { entertainment3 } from '../HardInstances/Entertainment3';

export type EntertainmentType = {
  id: number;
  businessName: string;
  reviewCount: number;
  category: string;
  rating: number;
  location: Array<string>;
  ageRestriction: number;
  price: string;
  delivery?: 'true' | 'false';
};
/*
 * The entertainments page
 * One of the three main model collection pages
 * Should contain a list of entertainments in a sortable table/grid
 */
const EntertainmentPage: React.FunctionComponent = () => {
  return (
    <div className="Entertainment">
      <h1>Entertainments</h1>
      <EntertainmentTable
        rows={[entertainment1, entertainment2, entertainment3]}
      />
    </div>
  );
};

export default EntertainmentPage;
