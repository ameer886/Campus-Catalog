import React from 'react';
import styles from './CampCatSplashPage.module.css';
import SplashGrid from './SplashGrid';

import { useState } from 'react';
import type { FilterPopoverOption } from '../../components/FilterPopover/FilterPopover';
import FilterPopover from '../../components/FilterPopover/FilterPopover';

const popoverOptions: FilterPopoverOption[] = [
  {
    header: 'Options',
    key: 'options',
    values: [
      { value: '1', displayStr: 'Option 1' },
      { value: '2', displayStr: 'Option 2' },
      { value: '3', displayStr: 'Option 3' },
    ],
  },
  {
    header: 'Apartment Type',
    key: 'type',
    values: [
      { value: 'apartment', displayStr: 'Apartment' },
      { value: 'condo', displayStr: 'Condo' },
      { value: 'townhome', displayStr: 'Town Home' },
      { value: 'house', displayStr: 'House' },
    ],
  },
  {
    header: 'State',
    key: 'state',
    displayStr: 'state',
  },
];

/*
 * The Splash Page
 * This is where everyone will arrive by default
 * Should contain links to all model pages and the about page
 */
const CampCatSplashPage: React.FunctionComponent = () => {
  const [filterStr, setFilterStr] = useState('');
  console.log(filterStr);

  return (
    <div className={styles.Centering}>
      <div className={styles.TextContainer}>
        <h1 className={styles.Title}>Campus Catalog</h1>
      </div>

      <div className={styles.TextContainer}>
        <h2 className={styles.Mission}>
          Struggling to find the right university?
          <br />
          Not sure where to live or where to spend your time?
        </h2>
      </div>
      <div className={styles.TextContainer}>
        <h3 className={styles.Help}>We&#39;re here to help.</h3>
      </div>

      <SplashGrid />

      <FilterPopover
        options={popoverOptions}
        setFilter={setFilterStr}
      />
    </div>
  );
};

export default CampCatSplashPage;
