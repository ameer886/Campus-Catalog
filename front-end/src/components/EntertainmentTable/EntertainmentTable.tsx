import React from 'react';

import { ColumnDefinitionType } from '../../components/GenericTable/GenericTable';
import PaginatedTable from '../../components/Pagination/PaginatedTable';
import { EntertainmentType } from '../../views/Entertainments/EntertainmentsPage';

import './EntertainmentTable.css';

type EntertainmentTableProps = {
  rows: Array<EntertainmentType>;
};

const entertainmentTableHeaders: ColumnDefinitionType<
  EntertainmentType,
  keyof EntertainmentType
>[] = [
  {
    key: 'businessName',
    header: 'Business Name',
    sortFunc: (a, b) => a.businessName.localeCompare(b.businessName),
  },
  {
    key: 'category',
    header: 'Category',
    sortFunc: (a, b) => a.category.localeCompare(b.category),
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
  {
    key: 'price',
    header: 'Price',
    sortFunc: (a, b) => a.price.localeCompare(b.price),
  },
  {
    key: 'ageRestriction',
    header: 'Age Restriction',
    sortFunc: (a, b) => {
      if (!a.ageRestriction) return 1;
      if (!b.ageRestriction) return -1;
      return a.ageRestriction - b.ageRestriction;
    },
    printFunc: (a) => {
      if (a.ageRestriction === 0) return 'None';
      else return a.ageRestriction.toString();
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
