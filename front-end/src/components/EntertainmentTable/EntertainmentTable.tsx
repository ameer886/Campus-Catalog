import React from 'react';

import { ColumnDefinitionType } from '../../components/GenericTable/GenericTable';
import PaginatedTable from '../../components/Pagination/PaginatedTable';
import { EntertainmentRowType } from '../../views/Entertainments/EntertainmentsPage';

import './EntertainmentTable.css';

type EntertainmentTableProps = {
  rows: Array<EntertainmentRowType>;
};

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

const EntertainmentTable: React.FunctionComponent<EntertainmentTableProps> =
  ({ rows }: EntertainmentTableProps) => {
    return (
      <div className="EntertainmentTable">
        <PaginatedTable
          columnDefinitions={entertainmentTableHeaders}
          data={rows}
        />
      </div>
    );
  };

export default EntertainmentTable;
