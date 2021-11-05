import React from 'react';
import { useState, useEffect } from 'react';

import type { ColumnDefinitionType } from '../../components/GenericTable/GenericTable';
import type { ApartmentRowType } from '../../views/Apartments/ApartmentsPage';
import type { IntentionallyAny } from '../../utilities';
import type { PaginationMeta } from '../../components/Pagination/PaginatedTable';

import PaginationRelay from '../Pagination/PaginationRelay';
import GenericTable from '../../components/GenericTable/GenericTable';

import { getAPI } from '../../APIClient';
import { formatNumberToMoney } from '../../utilities';

import './ApartmentTable.css';

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

const ApartmentTable: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<ApartmentRowType>>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1); // Pages are 1-indexed
  console.log(page);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await getAPI({ model: 'housing' });
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
  }, []);

  if (loading || meta == null)
    return <p>Loading, please be patient.</p>;

  return (
    <div className="ApartmentTable">
      <GenericTable
        columnDefinitions={apartmentTableHeaders}
        data={rows}
      />

      <PaginationRelay
        curPage={page}
        setPage={setPage}
        pageSize={PAGE_SIZE}
        totalElements={meta.total_items}
      />
    </div>
  );
};

export default ApartmentTable;
