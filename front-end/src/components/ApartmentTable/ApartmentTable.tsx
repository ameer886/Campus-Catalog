import React from 'react';

import GenericTable, {
  ColumnDefinitionType,
} from '../../components/GenericTable/GenericTable';
import { ApartmentType } from '../../views/Apartments/ApartmentsPage';

import './ApartmentTable.css';

type ApartmentTableProps = {
  rows: Array<ApartmentType>;
};

const apartmentTableHeaders: ColumnDefinitionType<
  ApartmentType,
  keyof ApartmentType
>[] = [
  {
    key: 'propertyName',
    header: 'Property Name',
    sortFunc: (a, b) => a.propertyName.localeCompare(b.propertyName),
  },
  {
    key: 'transitScore',
    header: 'Transit Score',
    sortFunc: (a, b) => {
      if (!a.transitScore) return -1;
      if (!b.transitScore) return 1;
      return a.transitScore - b.transitScore;
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
    key: 'beds',
    header: 'Bedrooms',
    sortFunc: (a, b) => a.propertyName.localeCompare(b.propertyName),
  },
  {
    key: 'walkScore',
    header: 'Walk Score',
    sortFunc: (a, b) => {
      if (!a.walkScore) return -1;
      if (!b.walkScore) return 1;
      return a.walkScore - b.walkScore;
    },
  },
];

const ApartmentTable: React.FunctionComponent<ApartmentTableProps> =
  ({ rows }: ApartmentTableProps) => {
    return (
      <div className="ApartmentTable">
        <GenericTable
          columnDefinitions={apartmentTableHeaders}
          data={rows}
        />
      </div>
    );
  };

export default ApartmentTable;
