import React from 'react';

import type { UniversityRowType } from '../Universities/UniversitiesPage';

import styles from './Search.module.css';
import SearchUniversitiesCard from './SearchUniversitiesCard';

type UnivColProps = {
  loading: boolean;
  query: string;
  rows: Array<UniversityRowType>;
};

const SearchUniversitiesColumn: React.FunctionComponent<UnivColProps> =
  ({ loading, query, rows }: UnivColProps) => {
    if (loading)
      return (
        <div className={styles.Column}>
          Loading university results, please wait
        </div>
      );

    return (
      <div className={styles.Column}>
        {rows.length === 0
          ? 'No universities could be found.'
          : rows.map((row, index) => (
              <SearchUniversitiesCard
                key={index}
                row={row}
                query={query}
              />
            ))}
      </div>
    );
  };

export default SearchUniversitiesColumn;
