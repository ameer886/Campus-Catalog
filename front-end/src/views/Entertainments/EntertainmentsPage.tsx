import React from 'react';
import { useState, useEffect } from 'react';
import './EntertainmentsPage.css';

import type {
  PropertyKey,
  UniversityKey,
} from '../../universalTypes';
import EntertainmentTable from '../../components/EntertainmentTable/EntertainmentTable';
import { getAPI } from '../../APIClient';
import { IntentionallyAny } from '../../utilities';

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
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<EntertainmentRowType>>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await getAPI({ model: 'amenities' });
        const responseRows = data.amenities.map(
          (amenity: IntentionallyAny) => {
            return {
              id: amenity.amen_id,
              ...amenity,
            };
          },
        );
        setRows(responseRows);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDataAsync();
  }, []);

  if (loading)
    return (
      <div className="Entertainments">
        <p>Loading responses, please be patient.</p>
      </div>
    );

  return (
    <div className="Entertainments">
      <h1>Amenities</h1>
      <EntertainmentTable rows={rows} />
    </div>
  );
};

export default EntertainmentsPage;
