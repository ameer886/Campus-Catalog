import React from 'react';
import { useMemo, useState } from 'react';
import styles from './UniversitiesPage.module.css';

import type {
  Address,
  AmenityKey,
  PropertyKey,
} from '../../universalTypes';
import UniversityGrid from '../../components/UniversityGrid/UniversityGrid';

import PaginationRelay from '../../components/Pagination/PaginationRelay';

const PAGE_SIZE = 9;

// Type of a single university
export type UniversityType = {
  acceptance_rate: number;
  alias: string | null;
  avg_cost_attendance: number;
  avg_sat: number;
  carnegie_undergrad: string;
  graduation_rate: number;
  image: string;
  latitude: number;
  locale: string;
  location: Address;
  longitude: number;
  num_graduate: number;
  num_undergrad: number;
  ownership_id: string;
  rank: number;
  school_url: string;
  tuition_in_st: number;
  tuition_out_st: number;
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

/*
 * This function should be passed a cards array and the order to sort them in
 * It will sort the cards depending on the sortOrder
 * Any unrecognized sortOrder string will not sort at all
 * Otherwise, try to use key_asc or key_desc (it's not required)
 * Definitely make sure each sortOrder has an _ and that desc ends in _desc
 */
function sortCards(cards: UniversityRowType[], sortOrder: string) {
  let sortFunc: (
    a: UniversityRowType,
    b: UniversityRowType,
  ) => number;
  switch (sortOrder.slice(0, sortOrder.indexOf('_'))) {
    case 'state':
      sortFunc = (a, b) => {
        if (!a.state) return -1;
        if (!b.state) return 1;
        return a.state.localeCompare(b.state);
      };
      break;
    case 'schoolName':
      sortFunc = (a, b) => a.univ_name.localeCompare(b.univ_name);
      break;
    case 'inStateTuition':
      sortFunc = (a, b) => {
        return a.tuition_in_st - b.tuition_in_st;
      };
      break;
    case 'outStateTuition':
      sortFunc = (a, b) => {
        return a.tuition_out_st - b.tuition_out_st;
      };
      break;
    default:
      return cards;
  }
  // Always sort asc
  cards.sort(sortFunc);
  // Reverse ascending if ends in _desc
  if (sortOrder.slice(sortOrder.indexOf('_') + 1) === 'desc')
    cards.reverse();
  return cards;
}

/*
 * The Universities page
 * One of the three main model collection pages
 * Should contain a list of universities in a sortable table/grid
 */
const UniversitiesPage: React.FunctionComponent = () => {
  const [sortOrder, setSortOrder] = useState('none');
  const [page, setPage] = useState(0);
  const cards: UniversityRowType[] = [];

  // wrapper to change the sort order of the cards
  const updateSort = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(e.target.value);
    setPage(0);
  };

  // Memoize card sorting because the calculation could get expensive
  const sortedCards = useMemo(() => {
    if (sortOrder === 'none') return cards;
    return sortCards(cards, sortOrder);
  }, [cards, sortOrder]);

  const cardSlice = useMemo(() => {
    return sortedCards.slice(
      page * PAGE_SIZE,
      (page + 1) * PAGE_SIZE,
    );
  }, [sortedCards, page]);

  return (
    <div className={styles.Universities}>
      <h1>Universities</h1>
      <div className={styles.UniversitySplitter}>
        {/* Build the grid on the left */}
        <div className={styles.SplitterGrid}>
          <UniversityGrid cards={cardSlice} />
          <PaginationRelay
            curPage={page}
            setPage={setPage}
            pageSize={PAGE_SIZE}
            totalElements={cards.length}
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
              sortOrder="none"
              defaultChecked
              onChange={updateSort}
            />

            {/* State inputs */}
            <UniversityInput
              displayStr="State (Ascending)"
              sortOrder="state_asc"
              onChange={updateSort}
            />
            <UniversityInput
              displayStr="State (Descending)"
              sortOrder="state_desc"
              onChange={updateSort}
            />

            {/* School Name inputs */}
            <UniversityInput
              displayStr="School Name (Ascending)"
              sortOrder="schoolName_asc"
              onChange={updateSort}
            />
            <UniversityInput
              displayStr="School Name (Descending)"
              sortOrder="schoolName_desc"
              onChange={updateSort}
            />

            {/* In-State inputs */}
            <UniversityInput
              displayStr="In-State Tuition (Ascending)"
              sortOrder="inStateTuition_asc"
              onChange={updateSort}
            />
            <UniversityInput
              displayStr="In-State Tuition (Descending)"
              sortOrder="inStateTuition_desc"
              onChange={updateSort}
            />

            {/* Out-of-State inputs */}
            <UniversityInput
              displayStr="Out-of-State Tuition (Ascending)"
              sortOrder="outStateTuition_asc"
              onChange={updateSort}
            />
            <UniversityInput
              displayStr="Out-of-State Tuition (Descending)"
              sortOrder="outStateTuition_desc"
              onChange={updateSort}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UniversitiesPage;
