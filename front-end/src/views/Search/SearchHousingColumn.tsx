import React from 'react';

import type { ApartmentRowType } from '../Apartments/ApartmentsPage';

import styles from './Search.module.css';
import SearchHousingCard from './SearchHousingCard';

type HousingColProps = {
  loading: boolean;
  query: string;
  rows: Array<ApartmentRowType>;
};

const SearchHousingColumn: React.FunctionComponent<HousingColProps> =
  ({ loading, query, rows }: HousingColProps) => {
    if (loading)
      return (
        <div className={styles.Column}>
          Loading housing results, please wait
        </div>
      );

    return (
      <div className={styles.Column}>
        {rows.length === 0
          ? 'No housing results could be found.'
          : rows.map((row, index) => (
              <SearchHousingCard
                key={index}
                row={row}
                query={query}
              />
            ))}
      </div>
    );
  };

export default SearchHousingColumn;
