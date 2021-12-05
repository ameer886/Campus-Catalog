import React from 'react';

import type { GenericDatumField } from './GenericCard';
import GenericCard from './GenericCard';

import styles from './Search.module.css';

/*
 * Complex component to allow us to abstract out complexity
 * of columns. We will still need column files to coerce
 * away any generics, but all they need to do is build a
 * basic object with their details rather than reimplement
 * both the entire column and the card details.
 */

// Type to get all column details into an object
type GenericColumnProps<T, K extends keyof T> = {
  loading: boolean; // Columns have loading strings if loading
  query: string; // Query i.e. what was searched
  rows: Array<T>; // Rows i.e. all the cards to build as objects

  name: string; // Name of the column i.e. housing, amenity, university
  color: string; // Color of the column
  attributes: Array<GenericDatumField<T, K>>; // attrs: see cards for details
  getHREF: (row: T) => string; // card fns: see GenericCard for details
  getName: (row: T) => string;
};

// T can be *any type* here
const GenericColumn = <T extends unknown, K extends keyof T>({
  loading,
  rows,
  name,
  ...rest // parameter pack everything that only the cards need
}: GenericColumnProps<T, K>): JSX.Element => {
  // Early return for loading string
  if (loading)
    return (
      <div className={styles.Column}>
        Loading {name} results, please wait
      </div>
    );

  // If not loading, display either empty result string or
  // build cards.
  return (
    <div className={styles.Column}>
      {rows.length === 0
        ? `No ${name} results could be found.`
        : rows.map((row, index) => (
            <GenericCard key={index} row={row} {...rest} />
          ))}
    </div>
  );
};

export default GenericColumn;
