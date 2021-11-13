import React, { useEffect } from 'react';
import { useState } from 'react';
import styles from './UniversitiesPage.module.css';

import type {
  Address,
  AmenityKey,
  PropertyKey,
} from '../../universalTypes';
import type { IntentionallyAny } from '../../utilities';
import UniversityGrid from '../../components/UniversityGrid/UniversityGrid';
import PaginationRelay from '../../components/Pagination/PaginationRelay';
import { getAPI } from '../../APIClient';
import { PaginationMeta } from '../../components/Pagination/PaginatedTable';

const PAGE_SIZE = 9;

// Type of a single university
export type UniversityType = {
  acceptance_rate?: number;
  alias: string | null;
  avg_cost_attendance?: number;
  avg_sat?: number;
  carnegie_undergrad: string;
  graduation_rate?: number;
  image: string;
  latitude: number;
  locale: string;
  location: Address;
  longitude: number;
  num_graduate?: number;
  num_undergrad?: number;
  ownership_id: string;
  rank: number;
  school_url: string;
  tuition_in_st?: number;
  tuition_out_st?: number;
  univ_id: string;
  univ_name: string;
  zip_code: string;

  amenities_nearby: Array<AmenityKey>;
  housing_nearby: Array<PropertyKey>;
};

export type UniversityRowType = {
  acceptance_rate: number;
  avg_cost_attendance: number;
  city: string;
  ownership_id: string;
  rank: number;
  state: string;
  tuition_in_st: number;
  tuition_out_st: number;
  univ_id: string;
  univ_name: string;

  id: string;
};

/*
 * Type to create a single university input button (radio button thing)
 * sortOrder is the sortOrder string that button selects
 * displayStr is the label of the button
 * defaultChecked should be set to true to make a button automatically be selected
 * onChange should just really be the setSortOrder function
 */
type UniversityInputProps = {
  sortOrder: string;
  displayStr: string;
  defaultChecked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/*
 * Build a single radio button for one of the sort orders
 */
const UniversityInput: React.FunctionComponent<UniversityInputProps> =
  ({
    sortOrder,
    displayStr,
    defaultChecked,
    onChange,
  }: UniversityInputProps) => {
    return (
      <div>
        <div className={styles.RadioButtonDiv}>
          <input
            className={styles.RadioButton}
            type="radio"
            value={sortOrder}
            id={sortOrder}
            name="sortOrder"
            defaultChecked={defaultChecked}
            onChange={(e) => onChange(e)}
          />
          <label htmlFor={sortOrder}>{displayStr}</label>
        </div>
      </div>
    );
  };

const UniversityInputPair: React.FunctionComponent<UniversityInputProps> =
  ({ sortOrder, displayStr, ...props }: UniversityInputProps) => {
    return (
      <>
        <UniversityInput
          displayStr={displayStr + ' (Ascending)'}
          sortOrder={sortOrder + '_asc'}
          {...props}
        />
        <UniversityInput
          displayStr={displayStr + ' (Descending)'}
          sortOrder={sortOrder + '_dsc'}
          {...props}
        />
      </>
    );
  };

/*
 * The Universities page
 * One of the three main model collection pages
 * Should contain a list of universities in a sortable table/grid
 */
const UniversitiesPage: React.FunctionComponent = () => {
  const [sortOrder, setSortOrder] = useState('NONE');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [cards, setCards] = useState<Array<UniversityRowType>>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        let params = `page=${page}&per_page=${PAGE_SIZE}`;
        if (sortOrder !== 'NONE') {
          params += `&sort=${sortOrder.slice(0, -4)}`;
          if (sortOrder.includes('dsc')) params += '&desc=True';
        }

        const data = await getAPI({
          model: 'universities',
          params: params,
        });
        const responseMeta: PaginationMeta = {
          ...data[0],
        };
        const responseCards = data[1].universities
          .map((university: IntentionallyAny) => {
            return {
              id: university.univ_id,
              ...university,
            };
          })
          .filter(
            (university: IntentionallyAny) => university.rank != null,
          );
        setCards(responseCards);
        setMeta(responseMeta);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDataAsync();
  }, [page, sortOrder]);

  // Note: ALL HOOKS must come before a return
  if (loading || meta == null)
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Universities</h1>
        <p>Loading responses, please be patient.</p>
      </div>
    );

  // wrapper to change the sort order of the cards
  const updateSort = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  return (
    <div className={styles.Universities}>
      <h1>Universities</h1>
      <div className={styles.UniversitySplitter}>
        {/* Build the grid on the left */}
        <div className={styles.SplitterGrid}>
          <UniversityGrid cards={cards} />
          <PaginationRelay
            curPage={page}
            setPage={(e) => {
              setLoading(true);
              setPage(e);
            }}
            pageSize={PAGE_SIZE}
            totalElements={meta.total_items}
          />
        </div>

        {/* Build the inputs on the right */}
        <div className={styles.SplitterInfo}>
          <p style={{ marginBottom: '0' }}>
            Select your desired sort order:
          </p>
          <form>
            {/* Default sort: do nothing */}
            <UniversityInput
              displayStr="None"
              sortOrder="NONE"
              defaultChecked
              onChange={updateSort}
            />

            {/* School Name inputs */}
            <UniversityInputPair
              displayStr="School Name"
              sortOrder="univ_name"
              onChange={updateSort}
            />

            {/* Rank inputs */}
            <UniversityInputPair
              displayStr="Rank"
              sortOrder="rank"
              onChange={updateSort}
            />

            {/* City inputs */}
            <UniversityInputPair
              displayStr="City"
              sortOrder="city"
              onChange={updateSort}
            />

            {/* State inputs */}
            <UniversityInputPair
              displayStr="State"
              sortOrder="state"
              onChange={updateSort}
            />

            {/* In-State inputs */}
            <UniversityInputPair
              displayStr="In-State Tuition"
              sortOrder="tuition_in_st"
              onChange={updateSort}
            />

            {/* Out-of-State inputs */}
            <UniversityInputPair
              displayStr="Out-of-State Tuition"
              sortOrder="tuition_out_st"
              onChange={updateSort}
            />

            {/* Acceptance Rate Inputs */}
            <UniversityInputPair
              displayStr="Acceptance Rate"
              sortOrder="acceptance_rate"
              onChange={updateSort}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UniversitiesPage;
