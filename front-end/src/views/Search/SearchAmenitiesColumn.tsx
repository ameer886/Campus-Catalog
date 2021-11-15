import React from 'react';

import type { EntertainmentRowType } from '../Entertainments/EntertainmentsPage';

import styles from './Search.module.css';
import SearchAmenitiesCard from './SearchAmenitiesCard';

type AmenColProps = {
  loading: boolean;
  rows: Array<EntertainmentRowType>;
};

const SearchAmenitiesColumn: React.FunctionComponent<AmenColProps> =
  ({ loading, rows }: AmenColProps) => {
    return (
      <div className={styles.Column}>
        {loading
          ? 'Loading university results, please wait'
          : rows.map((row, index) => (
              <SearchAmenitiesCard key={index} row={row} />
            ))}
      </div>
    );
  };

export default SearchAmenitiesColumn;
