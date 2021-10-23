import React from 'react';

import { ColumnDefinitionType } from '../../components/GenericTable/GenericTable';
import PaginatedTable from '../../components/Pagination/PaginatedTable';
import { ApartmentRowType } from '../../views/Apartments/ApartmentsPage';

import './ApartmentTable.css';

type ApartmentTableProps = {
  rows: Array<ApartmentRowType>;
};

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
  },
  {
    key: 'max_rent',
    header: 'Bedrooms',
    sortFunc: (a, b) => a.max_rent - b.max_rent,
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

const ApartmentTable: React.FunctionComponent<ApartmentTableProps> =
  ({ rows }: ApartmentTableProps) => {
    return (
      <div className="ApartmentTable">
        <PaginatedTable
          columnDefinitions={apartmentTableHeaders}
          data={rows}
        />
      </div>
    );
  };

export default ApartmentTable;
