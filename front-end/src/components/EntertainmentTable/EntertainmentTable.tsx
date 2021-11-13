import React from 'react';
import { useState, useEffect } from 'react';

import type { ColumnDefinitionType } from '../../components/GenericTable/GenericTable';
import type { EntertainmentRowType } from '../../views/Entertainments/EntertainmentsPage';
import type { IntentionallyAny } from '../../utilities';
import type { PaginationMeta } from '../../components/Pagination/PaginatedTable';

import GenericTable from '../GenericTable/GenericTable';
import PaginationRelay from '../Pagination/PaginationRelay';

import { getAPI } from '../../APIClient';

import './EntertainmentTable.css';

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

    useEffect(() => {
      if (testRows) {
        setRows(
          testRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        );
        return;
      }

      const fetchDataAsync = async () => {
        try {
          const data = await getAPI({
            model: 'amenities',
            params: `page=${page}&per_page=${PAGE_SIZE}`,
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
    }, [page]);

    if (loading || meta == null)
      return <p>Loading, please be patient.</p>;

    return (
      <div className="EntertainmentTable">
        <GenericTable
          columnDefinitions={entertainmentTableHeaders}
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

export default EntertainmentTable;
