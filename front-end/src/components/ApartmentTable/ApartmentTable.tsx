import React from 'react';
import { useState, useEffect } from 'react';

import type { ColumnDefinitionType } from '../../components/GenericTable/GenericTable';
import type { ApartmentRowType } from '../../views/Apartments/ApartmentsPage';
import type { IntentionallyAny } from '../../utilities';
import type { PaginationMeta } from '../../components/Pagination/PaginatedTable';
import type { FilterPopoverOption } from '../../components/FilterPopover/FilterPopover';

import PaginationRelay from '../Pagination/PaginationRelay';
import GenericTable from '../../components/GenericTable/GenericTable';
import FilterPopover from '../../components/FilterPopover/FilterPopover';

import { getAPI } from '../../APIClient';
import { formatNumberToMoney } from '../../utilities';

import styles from './ApartmentTable.module.css';

const PAGE_SIZE = 10;

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

const popoverOptions: FilterPopoverOption[] = [
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
    // A TON of useStates for managing this component, let's break them down
    // loading: if true, display a loading text instead of the table
    const [loading, setLoading] = useState(testRows == null);

    // rows: the actual data in the tables. Initially empty, set on query.
    const [rows, setRows] = useState<Array<ApartmentRowType>>([]);

    // meta: the meta information for the query i.e. page, total items, etc
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

    // page: the current query page
    const [page, setPage] = useState(1); // Pages are 1-indexed

    // filter: a string for the current filter e.g. "&state=TX&city=Austin"
    // const [filter, setFilter] = useState('&rating=any');
    const [filter, setFilter] = useState('');

    // sortStr: String for current sorting
    // of the form key_asc or key_dsc
    const [sortStr, setSortStr] = useState('NONE');

    /*
     * TODO: There's a big opportunity for refactor here!!!
     * Specifically, both model tables look nearly identical
     * with only two major differences: the column definitions
     * and the method fetchDataAsync. If sorting and filtering
     * don't change this flow too much, you can rework PaginatedTable
     * (which is no longer being used at all) to take in a property
     * for the column defs and a property for "getData" that
     * does all the processing except the state dispatches in
     * fetchDataAsync. This will allow the tables to specify
     * what the query and response look like while also removing
     * all the duplicated code.
     */
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
            if (sortStr.includes('dsc')) {
              params += '&desc=True';
            }
          }
          if (filter) params += filter;

          const data = await getAPI({
            model: 'housing',
            params: params,
          });
          const responseMeta: PaginationMeta = { ...data[0] };
          const responseRows = data[1].properties.map(
            (apt: IntentionallyAny) => {
              return {
                id: apt.property_id,
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
      <div className={styles.ApartmentTable}>
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
          columnDefinitions={apartmentTableHeaders}
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

export default ApartmentTable;
