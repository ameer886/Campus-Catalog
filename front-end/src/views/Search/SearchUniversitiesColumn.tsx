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
    return (
      <div className={styles.Column}>
        {loading
          ? 'Loading university results, please wait'
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
