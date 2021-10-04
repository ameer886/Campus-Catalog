import React from 'react';
import { useMemo, useState } from 'react';
import styles from './UniversitiesPage.module.css';

import UniversityGrid from '../../components/UniversityGrid/UniversityGrid';

import { university1 } from '../HardInstances/University1';
import { university2 } from '../HardInstances/University2';
import { university3 } from '../HardInstances/University3';

// Type of a single university
export type UniversityType = {
  id: number;
  schoolName: string;
  city?: string;
  state?: string;
  zipCode?: string;
  type?: 'Public' | 'Private';
  ranking?: number;
  undergradEnrollment?: number;
  graduateEnrollment?: number;
  inStateTuition?: number;
  outStateTuition?: number;
  mascot?: string;
  avgFinancialAid?: number;
  graduationRate?: number;
  acceptanceRate?: number;
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
function sortCards(cards: UniversityType[], sortOrder: string) {
  let sortFunc: (a: UniversityType, b: UniversityType) => number;
  switch (sortOrder.slice(0, sortOrder.indexOf('_'))) {
    case 'state':
      sortFunc = (a, b) => {
        if (!a.state) return -1;
        if (!b.state) return 1;
        return a.state.localeCompare(b.state);
      };
      break;
    case 'schoolName':
      sortFunc = (a, b) => a.schoolName.localeCompare(b.schoolName);
      break;
    case 'inStateTuition':
      sortFunc = (a, b) => {
        if (!a.inStateTuition) return -1;
        if (!b.inStateTuition) return 1;
        return a.inStateTuition - b.inStateTuition;
      };
      break;
    case 'outStateTuition':
      sortFunc = (a, b) => {
        if (!a.outStateTuition) return -1;
        if (!b.outStateTuition) return 1;
        return a.outStateTuition - b.outStateTuition;
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
  const cards = [university1, university2, university3];

  // wrapper to change the sort order of the cards
  const updateSort = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(e.target.value);
  };

  // Memoize card sorting because the calculation could get expensive
  const sortedCards = useMemo(() => {
    if (sortOrder === 'none') return cards;
    return sortCards(cards, sortOrder);
  }, [cards, sortOrder]);

  return (
    <div className={styles.Universities}>
      <h1>Universities</h1>
      <div className={styles.UniversitySplitter}>
        {/* Build the grid on the left */}
        <div className={styles.SplitterGrid}>
          <p style={{ marginBottom: '0px' }}>
            Found a total of {sortedCards.length} universities.
          </p>
          <UniversityGrid cards={sortedCards} />
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
