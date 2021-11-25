import React from 'react';
import { Card } from 'react-bootstrap';
import { IntentionallyAny } from '../../utilities';

import { getHighlightHTML } from './Search';

import styles from './Search.module.css';

/*
 * Complex generic file to abstract out card complexity
 * Uses generic typing to build identical cards without having
 * to think about typing or whatever
 *
 * Allows us to completely remove specific card details
 * other than color
 */

/*
 * Generic type for a single datum field
 * Will cause a row on the card to print out:
 *   <b>${name}</b>&nbsp<span>{attr.toString()}</span>
 * for each card
 *
 * T is any type, attribute must be a key for T
 */
export type GenericDatumField<T, K extends keyof T> = {
  name: string;
  attribute: K;
};

/*
 * This type is really messy but allows us to put all
 * implementation details into one object rather than
 * three react components
 */
type GenericCardProps<T, K extends keyof T> = {
  row: T; // The element this card represents
  query: string; // The current query to highlight

  color: string; // Color of the card border
  attributes: Array<GenericDatumField<T, K>>; // Attrs
  getHREF: (row: T) => string; // fn to get card link
  getName: (row: T) => string; // fn to get card name
};

const GenericCard = <T extends unknown, K extends keyof T>({
  row,
  query,
  color,
  attributes,
  getHREF,
  getName,
}: GenericCardProps<T, K>): JSX.Element => {
  /* map the attribute data to text in the card */
  const displayCardText = (row: T) => {
    return attributes.map((datum, index) => {
      const entry = row[datum.attribute];
      const str =
        entry != null
          ? (entry as IntentionallyAny).toString()
          : 'N/A';

      return (
        <Card.Text className="card-text-style" key={index}>
          <b>{datum.name} </b>
          {getHighlightHTML(str, query)}
        </Card.Text>
      );
    });
  };

  // Build the card itself generically
  return (
    <Card
      className={styles.SearchCard}
      style={{ borderColor: color }}
    >
      <Card.Body>
        <a href={getHREF(row)}>
          <u>
            <Card.Title className={styles['card-title-style']}>
              {getName(row)}
            </Card.Title>
          </u>
        </a>
        {displayCardText(row)}
      </Card.Body>
    </Card>
  );
};

export default GenericCard;
