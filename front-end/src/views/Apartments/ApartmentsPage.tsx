import React from 'react';
import { useState, useEffect } from 'react';
import './ApartmentsPage.css';

import type {
  AmenityKey,
  MinMaxPair,
  Address,
  UniversityKey,
} from '../../universalTypes';
import { getAPI } from '../../APIClient';
import { IntentionallyAny } from '../../utilities';

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

export type ApartmentRowType = {
  city: string;
  max_rent: number;
  max_sqft: number;
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
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<ApartmentRowType>>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await getAPI({ model: 'housing' });
        const responseRows = data.properties.map(
          (apt: IntentionallyAny) => {
            return {
              id: apt.property_id,
              ...apt,
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
      <div>
        <p>Loading responses, please be patient.</p>
      </div>
    );

  return (
    <div className="Apartments">
      <h1>Housing</h1>
      <ApartmentTable rows={rows} />
    </div>
  );
};

export default ApartmentsPage;
