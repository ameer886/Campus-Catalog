import React from 'react';
import { useState, useEffect } from 'react';

import type { ColumnDefinitionType } from '../../components/GenericTable/GenericTable';
import type { EntertainmentRowType } from '../../views/Entertainments/EntertainmentsPage';
import type { IntentionallyAny } from '../../utilities';
import type { PaginationMeta } from '../../components/Pagination/PaginatedTable';
import type { FilterPopoverOption } from '../../components/FilterPopover/FilterPopover';

import GenericTable from '../GenericTable/GenericTable';
import PaginationRelay from '../Pagination/PaginationRelay';
import FilterPopover from '../../components/FilterPopover/FilterPopover';

import { getAPI } from '../../APIClient';

import styles from './EntertainmentTable.module.css';

const PAGE_SIZE = 10;

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
    const [loading, setLoading] = useState(testRows == null);
    const [rows, setRows] = useState<Array<EntertainmentRowType>>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(
      testRows == null
        ? null
        : {
            page: 1,
            max_page: testRows.length / PAGE_SIZE,
            total_items: testRows.length,
            per_page: PAGE_SIZE,
          },
    );
    const [page, setPage] = useState(1); // Pages are 1-indexed
    const [filter, setFilter] = useState('');
    const [sortStr, setSortStr] = useState('NONE');

    useEffect(() => {
      if (testRows) {
        setRows(
          testRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        );
        return;
      }

      const fetchDataAsync = async () => {
        try {
          let params = `page=${page}&per_page=${PAGE_SIZE}`;
          if (sortStr !== 'NONE') {
            params += `&sort=${sortStr.slice(0, -4)}`;
            if (sortStr.includes('dsc')) params += '&desc=True';
          }
          if (filter) params += filter;

          const data = await getAPI({
            model: 'amenities',
            params: params,
          });
          const responseMeta: PaginationMeta = { ...data[0] };
          const responseRows = data[1].amenities.map(
            (apt: IntentionallyAny) => {
              return {
                id: apt.amen_id,
                ...apt,
              };
            },
          );
          setRows(responseRows);
          setMeta(responseMeta);
          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      };
      fetchDataAsync();
    }, [page, filter, sortStr]);

    if (loading || meta == null)
      return <p>Loading, please be patient.</p>;

    return (
      <div className={styles.EntertainmentTable}>
        <div>
          <div className={styles.FilterButton}>
            <FilterPopover
              options={popoverOptions}
              setFilter={(e) => {
                if (filter === e) return;
                setLoading(testRows == null);
                setPage(1);
                setFilter(e);
              }}
            />
          </div>
        </div>

        <GenericTable
          columnDefinitions={entertainmentTableHeaders}
          data={rows}
          parentSort={(e) => {
            setLoading(testRows == null);
            setPage(1);
            setSortStr(e);
          }}
          parentStr={sortStr}
        />

        <PaginationRelay
          curPage={page}
          setPage={(e) => {
            setLoading(testRows == null);
            setPage(e);
          }}
          pageSize={PAGE_SIZE}
          totalElements={meta.total_items}
        />
      </div>
    );
  };

export default EntertainmentTable;
