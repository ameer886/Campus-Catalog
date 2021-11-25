import React from 'react';

import type { GenericDatumField } from './GenericCard';
import type { UniversityRowType } from '../Universities/UniversitiesPage';

import GenericColumn from './GenericColumn';

/* attributes of a university */
const univAttrs: GenericDatumField<
  UniversityRowType,
  keyof UniversityRowType
>[] = [
  {
    name: 'Name:',
    attribute: 'univ_name',
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
    name: 'Ranking:',
    attribute: 'rank',
  },
];

// props to coerce T into UniversityRowType
type UnivColProps = {
  loading: boolean;
  query: string;
  rows: Array<UniversityRowType>;
};

const SearchUniversitiesColumn: React.FunctionComponent<UnivColProps> =
  ({ ...rest }: UnivColProps) => {
    // Build extra props specific to univ
    const univColProps = {
      name: 'university',
      color: 'green',
      attributes: univAttrs,
      getName: (row: UniversityRowType) => row.univ_name,
      getHREF: (row: UniversityRowType) => {
        return `/universities/${row.univ_id}`;
      },
    };

    return <GenericColumn {...univColProps} {...rest} />;
  };

export default SearchUniversitiesColumn;
