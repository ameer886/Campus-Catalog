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
    return (
      <div className={styles.Column}>
        {loading
          ? 'Loading university results, please wait'
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
