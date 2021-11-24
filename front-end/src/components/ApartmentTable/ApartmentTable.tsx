import React from 'react';
import { useState } from 'react';

import type { ColumnDefinitionType } from '../../components/GenericTable/GenericTable';
import type { ApartmentRowType } from '../../views/Apartments/ApartmentsPage';
import type { IntentionallyAny } from '../../utilities';
import type { FilterPopoverOption } from '../../components/FilterPopover/FilterPopover';

import PaginationRelay from '../Pagination/PaginationRelay';
import GenericTable from '../../components/GenericTable/GenericTable';
import PaginatedTable from '../../components/Pagination/PaginatedTable';
import FilterPopover from '../../components/FilterPopover/FilterPopover';

import { formatNumberToMoney } from '../../utilities';

import styles from './ApartmentTable.module.css';

const apartmentTableHeaders: ColumnDefinitionType<
  ApartmentRowType,
  keyof ApartmentRowType
>[] = [
  {
    key: 'property_name',
    header: 'Property Name',
  },
  {
    key: 'city',
    header: 'City',
  },
  {
    key: 'state',
    header: 'State',
  },
  {
    key: 'rating',
    header: 'Rating',
    printFunc: (a) => {
      if (a.rating === 0) return 'N/A';
      return a.rating.toString();
    },
  },
  {
    key: 'walk_score',
    header: 'Walk Score',
  },
  {
    key: 'transit_score',
    header: 'Transit Score',
  },
  {
    key: 'rent',
    header: 'Rent (Min - Max)',
    printFunc: (a) =>
      `${formatNumberToMoney(a.rent.min)} - ${formatNumberToMoney(
        a.rent.max,
      )}`,
  },
  {
    key: 'bed',
    header: 'Beds (Min - Max)',
    printFunc: (a) => `${a.bed.min} - ${a.bed.max}`,
  },
];

// This is exported for unit tests. You should not need to import it.
export const popoverOptions: FilterPopoverOption[] = [
  {
    header: 'Housing Type',
    key: 'type',
    variant: 'checkbox',
    boxValues: [
      {
        value: 'apartment',
        displayStr: 'Apartment',
        __checked: true,
      },
      { value: 'condo', displayStr: 'Condo', __checked: true },
      {
        value: 'townhome',
        displayStr: 'Town home',
        __checked: true,
      },
      { value: 'house', displayStr: 'House', __checked: true },
    ],
  },
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
    header: 'Rating',
    key: 'rating',
    variant: 'radio',
    boxValues: [
      { value: '0', displayStr: 'Any', __checked: true },
      { value: '1.0', displayStr: '>= 1.0' },
      { value: '2.0', displayStr: '>= 2.0' },
      { value: '3.0', displayStr: '>= 3.0' },
      { value: '4.0', displayStr: '>= 4.0' },
    ],
  },
  {
    header: 'Walk Score',
    key: 'walk_score',
    variant: 'checkbox',
    boxValues: [
      {
        value: '1',
        displayStr: "Walker's Paradise",
        __checked: true,
      },
      {
        value: '2',
        displayStr: 'Very Walkable',
        __checked: true,
      },
      {
        value: '3',
        displayStr: 'Somewhat Walkable',
        __checked: true,
      },
      {
        value: '4',
        displayStr: 'Car-Dependent',
        __checked: true,
      },
      {
        value: '5',
        displayStr: 'Very Car-Dependent',
        __checked: true,
      },
    ],
  },
  {
    header: 'Transit Score',
    key: 'transit_score',
    variant: 'checkbox',
    boxValues: [
      {
        value: '1',
        displayStr: "Rider's Paradise",
        __checked: true,
      },
      {
        value: '2',
        displayStr: 'Excellent Transit',
        __checked: true,
      },
      {
        value: '3',
        displayStr: 'Good Transit',
        __checked: true,
      },
      {
        value: '4',
        displayStr: 'Some Transit',
        __checked: true,
      },
      {
        value: '5',
        displayStr: 'Minimal Transit',
        __checked: true,
      },
    ],
  },
  {
    header: 'Rent',
    key: 'rent',
    inputValues: [
      { displayStr: 'Minimum rent', type: 'number', min: 0 },
      { displayStr: 'Maximum rent', type: 'number', min: 0 },
    ],
  },
  {
    header: 'Beds',
    key: 'bed',
    inputValues: [
      { displayStr: 'Minimum beds', type: 'number', min: 0 },
      { displayStr: 'Maximum beds', type: 'number', min: 0 },
    ],
  },
];

// This is an optional property to ONLY BE USED IN JEST TESTS
// PLEASE do not use testRows in production
type ApartmentTableTestProps = {
  testRows?: Array<ApartmentRowType>;
};

const ApartmentTable: React.FunctionComponent<ApartmentTableTestProps> =
  ({ testRows }: ApartmentTableTestProps) => {
    if (testRows) {
      // Hack around queries to get a "table" that tests the basic fns
      // We need to avoid any kind of query while keeping tests functional
      // If testRows is not undefined, then this will most certainly
      // crash the front-end
      const ps = 10;
      const [sortStr, setSortStr] = useState('NONE');
      const [filter, setFilter] = useState('');
      const [page, setPage] = useState(1);

      return (
        <div className={styles.ApartmentTable}>
          <div>
            <div className={styles.FilterButton}>
              <FilterPopover
                options={popoverOptions}
                setFilter={(e: string) => {
                  if (filter === e) return;
                  setFilter(e);
                }}
              />
            </div>
          </div>

          <GenericTable
            columnDefinitions={apartmentTableHeaders}
            data={testRows.slice((page - 1) * ps, page * ps)}
            parentSort={setSortStr}
            parentStr={sortStr}
          />

          <PaginationRelay
            curPage={page}
            setPage={setPage}
            pageSize={ps}
            totalElements={testRows.length}
          />
        </div>
      );
    }

    const processResponse = (data: IntentionallyAny) => {
      const responseRows = data[1].properties.map(
        (apt: IntentionallyAny) => {
          return {
            id: apt.property_id,
            ...apt,
          };
        },
      );
      return responseRows;
    };

    return (
      <div className={styles.ApartmentTable}>
        <PaginatedTable
          options={popoverOptions}
          processResponse={processResponse}
          model="housing"
          columnDefinitions={apartmentTableHeaders}
        />
      </div>
    );
  };

export default ApartmentTable;
