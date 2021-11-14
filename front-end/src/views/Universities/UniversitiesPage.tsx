import React, { useEffect } from 'react';
import { useState } from 'react';
import styles from './UniversitiesPage.module.css';

import type {
  Address,
  AmenityKey,
  PropertyKey,
} from '../../universalTypes';
import type { PaginationMeta } from '../../components/Pagination/PaginatedTable';
import type { IntentionallyAny } from '../../utilities';
import type { FilterPopoverOption } from '../../components/FilterPopover/FilterPopover';

import FilterPopover from '../../components/FilterPopover/FilterPopover';
import UniversityGrid from '../../components/UniversityGrid/UniversityGrid';
import PaginationRelay from '../../components/Pagination/PaginationRelay';

import { getAPI } from '../../APIClient';

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

const popoverOptions: FilterPopoverOption[] = [
  {
    header: 'City',
    key: 'city',
    inputValues: [
      {
        displayStr: 'Enter City here',
        // Capitalize only the first letter
        cleanFunc: (e) =>
          e
            .trim()
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase()),
      },
    ],
  },
  {
    header: 'State',
    key: 'state',
    inputValues: [
      {
        displayStr: 'Enter state here (ex: TX)',
        cleanFunc: (e) => e.trim().toUpperCase(),
      },
    ],
  },
  {
    header: 'Acceptance Rate',
    key: 'accept',
    inputValues: [
      {
        displayStr: 'Minimum Acceptance %',
        type: 'number',
        min: 0,
        max: 100,
        cleanFunc: (e) => (parseInt(e) / 100.0).toFixed(2),
      },
    ],
  },
  {
    header: 'Graduation Rate',
    key: 'grad',
    inputValues: [
      {
        displayStr: 'Minimum Graduation %',
        type: 'number',
        min: 0,
        max: 100,
        cleanFunc: (e) => (parseInt(e) / 100.0).toFixed(2),
      },
    ],
  },
  {
    header: 'Ownership',
    key: 'ownership_id',
    variant: 'radio',
    boxValues: [
      { displayStr: 'Any', value: '', __checked: true },
      { displayStr: 'Public', value: '1' },
      { displayStr: 'Private Non-Profit', value: '2' },
      { displayStr: 'Private For-Profit', value: '3' },
    ],
  },
];

const inputPairs = [
  { displayStr: 'School Name', sortOrder: 'univ_name' },
  { displayStr: 'Rank', sortOrder: 'rank' },
  { displayStr: 'City', sortOrder: 'city' },
  { displayStr: 'State', sortOrder: 'state' },
  { displayStr: 'In-State Tuition', sortOrder: 'tuition_in_st' },
  { displayStr: 'Out-of-State Tuition', sortOrder: 'tuition_out_st' },
  { displayStr: 'Acceptance Rate', sortOrder: 'acceptance_rate' },
];

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
  defaultCheckedFunc?: (mySort: string) => boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/*
 * Build a single radio button for one of the sort orders
 */
const UniversityInput: React.FunctionComponent<UniversityInputProps> =
  ({
    sortOrder,
    displayStr,
    defaultCheckedFunc,
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
            defaultChecked={
              defaultCheckedFunc
                ? defaultCheckedFunc(sortOrder)
                : false
            }
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
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        let params = `page=${page}&per_page=${PAGE_SIZE}`;
        if (sortOrder !== 'NONE') {
          params += `&sort=${sortOrder.slice(0, -4)}`;
          if (sortOrder.includes('dsc')) params += '&desc=True';
        }
        if (filter) params += filter;
        console.log(params);

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
  }, [page, filter, sortOrder]);

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
    setLoading(true);
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
          <FilterPopover
            options={popoverOptions}
            setFilter={(e) => {
              setPage(1);
              setLoading(true);
              setFilter(e);
            }}
          />
          <p style={{ marginBottom: '0' }}>
            Select your desired sort order:
          </p>
          <form>
            {/* Default sort: do nothing */}
            <UniversityInput
              displayStr="None"
              sortOrder="NONE"
              defaultCheckedFunc={(s) => s === sortOrder}
              onChange={updateSort}
            />

            {/* All pairs */}
            {inputPairs.map((input, index) => (
              <UniversityInputPair
                key={index}
                displayStr={input.displayStr}
                sortOrder={input.sortOrder}
                onChange={updateSort}
                defaultCheckedFunc={(s) => s === sortOrder}
              />
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UniversitiesPage;
