import React from 'react';
import { useState } from 'react';
import styles from './UniversitiesPage.module.css';

import UniversityGrid from '../../components/UniversityGrid/UniversityGrid';

import { university1 } from '../HardInstances/University1';
import { university2 } from '../HardInstances/University2';
import { university3 } from '../HardInstances/University3';

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

type UniversityInputProps = {
  sortOrder: string;
  displayStr: string;
  defaultChecked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

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
 * The Universities page
 * One of the three main model collection pages
 * Should contain a list of universities in a sortable table/grid
 */
const UniversitiesPage: React.FunctionComponent = () => {
  const [sortOrder, setSortOrder] = useState('none');
  const cards = [university1, university2, university3];

  const updateSort = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(e.target.value);
  };
  console.log(sortOrder);

  return (
    <div className={styles.Universities}>
      <h1>Universities</h1>
      <div className={styles.UniversitySplitter}>
        <div className={styles.SplitterGrid}>
          <UniversityGrid cards={cards} />
        </div>

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
