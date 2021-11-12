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
    // Anti-pattern: rent has two keys but I can only use one
    key: 'max_rent',
    header: 'Rent (Min - Max)',
    printFunc: (a) =>
      `${formatNumberToMoney(a.min_rent)} - ${formatNumberToMoney(
        a.max_rent,
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
        defaultChecked: true,
      },
      { value: 'condo', displayStr: 'Condo', defaultChecked: true },
      {
        value: 'townhome',
        displayStr: 'Town home',
        defaultChecked: true,
      },
      { value: 'house', displayStr: 'House', defaultChecked: true },
    ],
  },
  {
    header: 'City, State',
    key: 'cityState',
    inputValues: [{ displayStr: 'Enter City, ST here' }],
  },
  {
    header: 'Rating',
    key: 'rating',
    variant: 'radio',
    boxValues: [
      { value: 'any', displayStr: 'Any', defaultChecked: true },
      { value: '1', displayStr: '>= 1.0' },
      { value: '2', displayStr: '>= 2.0' },
      { value: '3', displayStr: '>= 3.0' },
      { value: '4', displayStr: '>= 4.0' },
    ],
  },
  {
    header: 'Walk Score',
    key: 'walkscore',
    variant: 'checkbox',
    boxValues: [
      {
        value: '0',
        displayStr: "Walker's Paradise",
        defaultChecked: true,
      },
      {
        value: '1',
        displayStr: 'Very Walkable',
        defaultChecked: true,
      },
      {
        value: '2',
        displayStr: 'Somewhat Walkable',
        defaultChecked: true,
      },
      {
        value: '3',
        displayStr: 'Car-Dependent',
        defaultChecked: true,
      },
      {
        value: '4',
        displayStr: 'Very Car-Dependent',
        defaultChecked: true,
      },
    ],
  },
  {
    header: 'Transit Score',
    key: 'transitscore',
    variant: 'checkbox',
    boxValues: [
      {
        value: '0',
        displayStr: "Rider's Paradise",
        defaultChecked: true,
      },
      {
        value: '1',
        displayStr: 'Excellent Transit',
        defaultChecked: true,
      },
      {
        value: '2',
        displayStr: 'Good Transit',
        defaultChecked: true,
      },
      {
        value: '3',
        displayStr: 'Some Transit',
        defaultChecked: true,
      },
      {
        value: '4',
        displayStr: 'Minimal Transit',
        defaultChecked: true,
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
    key: 'beds',
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
    }, [page, filter]);

    if (loading || meta == null)
      return <p>Loading, please be patient.</p>;

    return (
      <div className={styles.ApartmentTable}>
        <div>
          <div className={styles.FilterButton}>
            <FilterPopover
              options={popoverOptions}
              setFilter={(e) => {
                setLoading(testRows == null);
                setFilter(e);
              }}
            />
          </div>
        </div>

        <GenericTable
          columnDefinitions={apartmentTableHeaders}
          data={rows}
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
