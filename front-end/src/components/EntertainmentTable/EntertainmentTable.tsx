import React from 'react';
import { useState } from 'react';

import type { ColumnDefinitionType } from '../../components/GenericTable/GenericTable';
import type { EntertainmentRowType } from '../../views/Entertainments/EntertainmentsPage';
import type { IntentionallyAny } from '../../utilities';
import type { FilterPopoverOption } from '../../components/FilterPopover/FilterPopover';

import GenericTable from '../GenericTable/GenericTable';
import PaginationRelay from '../Pagination/PaginationRelay';
import PaginatedTable from '../../components/Pagination/PaginatedTable';
import FilterPopover from '../../components/FilterPopover/FilterPopover';

import styles from './EntertainmentTable.module.css';

const entertainmentTableHeaders: ColumnDefinitionType<
  EntertainmentRowType,
  keyof EntertainmentRowType
>[] = [
  {
    key: 'amen_name',
    header: 'Amenity Name',
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
    key: 'num_review',
    header: 'Reviews',
  },
  {
    key: 'pricing',
    header: 'Price',
  },
  {
    key: 'rating',
    header: 'Rating',
  },
];

// This is exported for unit tests. You should not need to import it.
export const popoverOptions: FilterPopoverOption[] = [
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
    key: 'rate',
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
    header: 'Reviews',
    key: 'reviews',
    inputValues: [
      {
        displayStr: 'Minimum # of reviews',
        min: 0,
        type: 'number',
      },
    ],
  },
  {
    header: 'Price',
    key: 'price',
    variant: 'checkbox',
    boxValues: [
      { value: '$', displayStr: '$', __checked: true },
      { value: '$$', displayStr: '$$', __checked: true },
      { value: '$$$', displayStr: '$$$', __checked: true },
      { value: '$$$$', displayStr: '$$$$', __checked: true },
      { value: '$$$$$', displayStr: '$$$$$', __checked: true },
    ],
  },
  {
    header: 'Delivery',
    key: 'delivery',
    variant: 'radio',
    boxValues: [
      { value: 'True', displayStr: 'Has Delivery' },
      { value: 'False', displayStr: 'No Delivery' },
      { value: '', displayStr: 'Any', __checked: true },
    ],
  },
  {
    header: 'Takeout',
    key: 'takeout',
    variant: 'radio',
    boxValues: [
      { value: 'True', displayStr: 'Has Takeout' },
      { value: 'False', displayStr: 'No Takeout' },
      { value: '', displayStr: 'Any', __checked: true },
    ],
  },
];

// This is an optional property to ONLY BE USED IN JEST TESTS
// PLEASE do not use testRows in production
type EntertainmentTableTestProps = {
  testRows?: Array<EntertainmentRowType>;
};

const EntertainmentTable: React.FunctionComponent<EntertainmentTableTestProps> =
  ({ testRows }: EntertainmentTableTestProps) => {
    if (testRows) {
      // Hack around queries to get a "table" that tests the basic fns
      // We need to avoid any kind of query while keeping tests functional
      // If testRows is not undefined, then this will most certainly
      // crash the front-end
      const ps = 10;
      const [filter, setFilter] = useState('');
      const [sortStr, setSortStr] = useState('NONE');
      const [page, setPage] = useState(1);

      return (
        <div className={styles.EntertainmentTable}>
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
            columnDefinitions={entertainmentTableHeaders}
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
      const responseRows = data[1].amenities.map(
        (amen: IntentionallyAny) => {
          return {
            id: amen.amen_id,
            ...amen,
          };
        },
      );
      return responseRows;
    };

    return (
      <div className={styles.EntertainmentTable}>
        <PaginatedTable
          options={popoverOptions}
          processResponse={processResponse}
          model="amenities"
          columnDefinitions={entertainmentTableHeaders}
        />
      </div>
    );
  };

export default EntertainmentTable;
