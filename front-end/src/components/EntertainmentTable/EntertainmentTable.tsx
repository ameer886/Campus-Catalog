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
    sortFunc: (a, b) => a.amen_name.localeCompare(b.amen_name),
  },
  {
    key: 'city',
    header: 'City',
    sortFunc: (a, b) => a.city.localeCompare(b.city),
  },
  {
    key: 'state',
    header: 'State',
    sortFunc: (a, b) => a.state.localeCompare(b.state),
  },
  {
    key: 'num_review',
    header: 'Reviews',
    sortFunc: (a, b) => {
      if (!a.num_review) return 1;
      if (!b.num_review) return -1;
      return a.num_review - b.num_review;
    },
  },
  {
    key: 'pricing',
    header: 'Price',
    sortFunc: (a, b) => {
      if (a.pricing === 'N/A') return -1;
      if (b.pricing === 'N/A') return 1;
      return a.pricing.localeCompare(b.pricing);
    },
  },
  {
    key: 'rating',
    header: 'Rating',
    sortFunc: (a, b) => {
      if (!a.rating) return 1;
      if (!b.rating) return -1;
      return a.rating - b.rating;
    },
  },
];

const EntertainmentTable: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<EntertainmentRowType>>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1); // Pages are 1-indexed

  useEffect(() => {
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
          setLoading(true);
          setPage(e);
        }}
        pageSize={PAGE_SIZE}
        totalElements={meta.total_items}
      />
    </div>
  );
};

export default EntertainmentTable;
