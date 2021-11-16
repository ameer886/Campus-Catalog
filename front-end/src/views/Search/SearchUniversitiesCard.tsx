import React from 'react';
import { Card } from 'react-bootstrap';

import type { UniversityRowType } from '../Universities/UniversitiesPage';

import { getHighlightHTML } from './Search';

import styles from './Search.module.css';

/* attributes of a city */
const univ_attributes = [
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

type UnivCardProps = {
  row: UniversityRowType;
  query: string;
};

/* displays card for a city result
in the search page */
const SearchUniversitiesCard: React.FunctionComponent<UnivCardProps> =
  ({ row, query }: UnivCardProps) => {
    /* map the attribute data to text in the card */
    const displayCardText = (row: UniversityRowType) => {
      return univ_attributes.map((univ, index) => (
        <Card.Text className="card-text-style" key={index}>
          <b>{univ.name} </b>
          {row[univ.attribute] ? (
            getHighlightHTML(row[univ.attribute].toString(), query)
          ) : (
            <span>N/A</span>
          )}
        </Card.Text>
      ));
    };

    return (
      <Card
        className={styles.SearchCard}
        style={{ borderColor: 'green' }}
      >
        <Card.Body>
          <a href={'/universities/' + row.univ_id}>
            <u>
              <Card.Title className={styles['card-title-style']}>
                {row.univ_name}
              </Card.Title>
            </u>
          </a>
          {displayCardText(row)}
        </Card.Body>
      </Card>
    );
  };
export default SearchUniversitiesCard;
