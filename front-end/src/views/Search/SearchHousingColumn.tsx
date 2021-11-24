import React from 'react';

import type { GenericDatumField } from './GenericCard';
import type { ApartmentRowType } from '../Apartments/ApartmentsPage';

import GenericColumn from './GenericColumn';

/* attributes of a housing */
const housingAttrs: GenericDatumField<
  ApartmentRowType,
  keyof ApartmentRowType
>[] = [
  {
    name: 'Name:',
    attribute: 'property_name',
  },
  {
    name: 'City:',
    attribute: 'city',
  },
  {
    name: 'State:',
    attribute: 'state',
  },
];

// props to coerce T into ApartmentRowType
type HousingColProps = {
  loading: boolean;
  query: string;
  rows: Array<ApartmentRowType>;
};

const SearchHousingColumn: React.FunctionComponent<HousingColProps> =
  ({ ...rest }: HousingColProps) => {
    // Build extra props specific to housing
    const housingColProps = {
      name: 'housing',
      color: 'red',
      attributes: housingAttrs,
      getName: (row: ApartmentRowType) => row.property_name,
      getHREF: (row: ApartmentRowType) => {
        return `/housing/${row.property_id}`;
      },
    };

    return <GenericColumn {...housingColProps} {...rest} />;
  };

export default SearchHousingColumn;
