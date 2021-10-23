import React from 'react';
import './ApartmentsPage.css';
import axios from 'axios';

import type {
  AmenityKey,
  MinMaxPair,
  Address,
  UniversityKey,
} from '../../universalTypes';

import ApartmentTable from '../../components/ApartmentTable/ApartmentTable';

import { apartment1 } from '../HardInstances/Apartment1';

export type ApartmentType = {
  bath: MinMaxPair;
  bed: MinMaxPair;
  building_amenities: Array<string>;
  cat_allow: boolean;
  cat_weight?: number | null;
  dog_allow: boolean;
  dog_weight?: number | null;
  location: Address;
  images: Array<string>;
  max_num_cat: number;
  max_num_dog: number;
  max_rent: number;
  min_rent: number;
  neighborhood: string;
  property_id: string;
  property_name: string;
  property_type: string;
  rating: number;
  sqft: MinMaxPair;
  transit_score: number;
  util_included?: boolean | null;
  walk_score: number;

  amenities_nearby: Array<AmenityKey>;
  universities_nearby: Array<UniversityKey>;

  id: string;
};

/*
 * The Apartments page
 * One of the three main model collection pages
 * Should contain a list of apartments in a sortable table/grid
 */
const ApartmentsPage: React.FunctionComponent = () => {
  const rows = [];
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
