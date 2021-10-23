import React from 'react';
import './ApartmentsPage.css';
import axios from 'axios';

import ApartmentTable from '../../components/ApartmentTable/ApartmentTable';

import { apartment1 } from '../HardInstances/Apartment1';
import { apartment2 } from '../HardInstances/Apartment2';
import { apartment3 } from '../HardInstances/Apartment3';

export type ApartmentType = {
  id: number;
  propertyName: string;
  location: Array<string>;
  minRent?: number;
  maxRent?: number;
  beds?: string;
  baths?: string;
  sqft?: string;
  petFriendly?: 'true' | 'false';
  schools: Array<string>;
  amenities?: Array<string>;
  rating?: number;
  walkScore?: number;
  transitScore?: number;
};

/*
 * The Apartments page
 * One of the three main model collection pages
 * Should contain a list of apartments in a sortable table/grid
 */
const ApartmentsPage: React.FunctionComponent = () => {
  const rows = [apartment1, apartment2, apartment3];
  for (let i = 0; i < 200; i++) {
    rows.push(apartment1);
  }

  const client = axios.create({
    baseURL:
      process.env.REACT_APP_API_URL ?? 'https://api.campuscatalog.me',
  });
  client.get('/housing').then(console.log);

  return (
    <div className="Apartments">
      <h1>Apartments</h1>
      <ApartmentTable rows={rows} />
    </div>
  );
};

export default ApartmentsPage;
