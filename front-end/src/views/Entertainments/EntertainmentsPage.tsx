import React from 'react';
import './EntertainmentsPage.css';

import type {
  PropertyKey,
  UniversityKey,
} from '../../universalTypes';
import EntertainmentTable from '../../components/EntertainmentTable/EntertainmentTable';

export type EntertainmentType = {
  address: string;
  amen_alias: string;
  amen_id: number;
  amen_name: string;
  categories: Array<string>;
  city: string;
  deliver: boolean;
  hours: string;
  images: Array<string>;
  latitude: number;
  longitude: number;
  num_review: number;
  pricing: string;
  rating: number;
  reviews: Array<{
    review_id: string;
    user_id: string;
    user_name: string;
  }>;
  state: string;
  takeout: boolean;
  yelp_id: string;
  zip_code: string;

  housing_nearby: Array<PropertyKey>;
  universities_nearby: Array<UniversityKey>;
};

export type EntertainmentRowType = {
  amen_id: number;
  amen_name: string;
  city: string;
  deliver: boolean;
  num_review: number;
  pricing: string;
  rating: number;
  state: string;
  takeout: boolean;

  id: number;
};

/*
 * The entertainments page
 * One of the three main model collection pages
 * Should contain a list of entertainments in a sortable table/grid
 */
const EntertainmentsPage: React.FunctionComponent = () => {
  return (
    <div className="Entertainments">
      <h1>Amenities</h1>
      <EntertainmentTable />
    </div>
  );
};

export default EntertainmentsPage;
