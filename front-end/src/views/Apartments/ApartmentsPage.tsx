import React from 'react';
import './ApartmentsPage.css';

import ApartmentTable from '../../components/ApartmentTable/ApartmentTable';

import {apartment1}  from '../HardInstances/Apartment1';
import {apartment2} from '../HardInstances/Apartment2';
import {apartment3} from '../HardInstances/Apartment3';

export type ApartmentsType = {
  id: number;
  propertyName: string;
  location: Array<string>;
  minRent?: number;
  maxRent?: number;
  beds?: string;
  baths?: string;
  sqft?: string;
  petFriendly?: boolean;
  schools?:Array<string>;
  amenities?:Array<string>;
  rating?:number;
  walkScore?:number;
  transitScore?:number;
};
/*
 * The Apartments page
 * One of the three main model collection pages
 * Should contain a list of apartments in a sortable table/grid
 */
const ApartmentPage: React.FunctionComponent = () => {
  return (
    <div className="Apartments">
      <h1>Apartments</h1>
      <ApartmentTable
        rows={[apartment1, apartment2, apartment3]}
      />
    </div>
  );
};

export default ApartmentPage;
