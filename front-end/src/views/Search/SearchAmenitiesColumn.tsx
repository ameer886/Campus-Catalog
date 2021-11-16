import React from 'react';

import type { EntertainmentRowType } from '../Entertainments/EntertainmentsPage';

import styles from './Search.module.css';
import SearchAmenitiesCard from './SearchAmenitiesCard';

type AmenColProps = {
  loading: boolean;
  query: string;
  rows: Array<EntertainmentRowType>;
};

const SearchAmenitiesColumn: React.FunctionComponent<AmenColProps> =
  ({ loading, query, rows }: AmenColProps) => {
    if (loading)
      return (
        <div className={styles.Column}>
          Loading amenity results, please wait
        </div>
      );

    return (
      <div className={styles.Column}>
        {rows.length === 0
          ? 'No amenities could be found.'
          : rows.map((row, index) => (
              <SearchAmenitiesCard
                key={index}
                row={row}
                query={query}
              />
            ))}
      </div>
    );
  };

export default SearchAmenitiesColumn;
