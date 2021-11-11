import React from 'react';
import './ApartmentsPage.css';

import type {
  AmenityKey,
  MinMaxPair,
  Address,
  UniversityKey,
} from '../../universalTypes';

import ApartmentTable from '../../components/ApartmentTable/ApartmentTable';

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
};

export type ApartmentRowType = {
  bed: MinMaxPair;
  city: string;
  max_rent: number;
  max_sqft: number;
  min_rent: number;
  property_id: string;
  property_name: string;
  property_type: string;
  rating: number;
  state: string;
  transit_score: number;
  walk_score: number;

  id: string;
};

/*
 * The Apartments page
 * One of the three main model collection pages
 * Should contain a list of apartments in a sortable table/grid
 */
const ApartmentsPage: React.FunctionComponent = () => {
  return (
    <div className="Apartments">
      <h1>Housing</h1>
      <ApartmentTable />
    </div>
  );
};

export default ApartmentsPage;
