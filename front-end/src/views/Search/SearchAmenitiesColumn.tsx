import React from 'react';

import type { GenericDatumField } from './GenericCard';
import type { EntertainmentRowType } from '../Entertainments/EntertainmentsPage';

import GenericColumn from './GenericColumn';

/* attributes of an amenity */
const amenityAttrs: GenericDatumField<
  EntertainmentRowType,
  keyof EntertainmentRowType
>[] = [
  {
    name: 'Name:',
    attribute: 'amen_name',
  },
  {
    name: 'City:',
    attribute: 'city',
  },
  {
    name: 'State:',
    attribute: 'state',
  },
  {
    name: 'Rating:',
    attribute: 'rating',
  },
];

// props to coerce T into EntertainmentRowType
type AmenColProps = {
  loading: boolean;
  query: string;
  rows: Array<EntertainmentRowType>;
};

const SearchAmenitiesColumn: React.FunctionComponent<AmenColProps> =
  ({ ...rest }: AmenColProps) => {
    // Build extra props specific to amenity
    const amenityColProps = {
      name: 'amenity',
      color: 'blue',
      attributes: amenityAttrs,
      getName: (row: EntertainmentRowType) => row.amen_name,
      getHREF: (row: EntertainmentRowType) => {
        return `/amenities/${row.amen_id}`;
      },
    };

    return <GenericColumn {...amenityColProps} {...rest} />;
  };

export default SearchAmenitiesColumn;
