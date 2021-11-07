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
    sortFunc: (a, b) =>
      a.property_name.localeCompare(b.property_name),
  },
  {
    key: 'transit_score',
    header: 'Transit Score',
    sortFunc: (a, b) => {
      if (!a.transit_score) return -1;
      if (!b.transit_score) return 1;
      return a.transit_score - b.transit_score;
    },
  },
  {
    key: 'rating',
    header: 'Rating',
    sortFunc: (a, b) => {
      if (!a.rating) return -1;
      if (!b.rating) return 1;
      return a.rating - b.rating;
    },
    printFunc: (a) => {
      if (a.rating === 0) return 'N/A';
      return a.rating.toString();
    },
  },
  {
    key: 'max_rent',
    header: 'Maximum Rent',
    sortFunc: (a, b) => a.max_rent - b.max_rent,
    printFunc: (a) => formatNumberToMoney(a.max_rent),
  },
  {
    key: 'walk_score',
    header: 'Walk Score',
    sortFunc: (a, b) => {
      if (!a.walk_score) return -1;
      if (!b.walk_score) return 1;
      return a.walk_score - b.walk_score;
    },
  },
];

const popoverOptions: FilterPopoverOption[] = [
  {
    header: 'Housing Type',
    key: 'type',
    values: [
      { value: 'apartment', displayStr: 'Apartment' },
      { value: 'condo', displayStr: 'Condo' },
      { value: 'townhome', displayStr: 'Town home' },
      { value: 'house', displayStr: 'House' },
    ],
  },
  {
    header: 'City',
    key: 'city',
    displayStr: 'city',
  },
  {
    header: 'State',
    key: 'state',
    displayStr: 'state',
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
