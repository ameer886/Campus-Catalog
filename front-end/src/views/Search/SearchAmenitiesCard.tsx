import React from 'react';
import { Card } from 'react-bootstrap';

import type { EntertainmentRowType } from '../Entertainments/EntertainmentsPage';

import { getHighlightHTML } from './Search';

import styles from './Search.module.css';

/* attributes of a city */
const amenities_attributes = [
  {
    name: 'Name:',
    attribute: 'amen_name',
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
    name: 'Rating:',
    attribute: 'rating',
  },
];

type AmenCardProps = {
  row: EntertainmentRowType;
  query: string;
};

/* displays card for a city result
in the search page */
const SearchAmenitiesCard: React.FunctionComponent<AmenCardProps> = ({
  row,
  query,
}: AmenCardProps) => {
  /* map the attribute data to text in the card */
  const displayCardText = (row: EntertainmentRowType) => {
    return amenities_attributes.map((amenity, index) => (
      <Card.Text className="card-text-style" key={index}>
        <b>{amenity.name} </b>
        {getHighlightHTML(row[amenity.attribute].toString(), query)}
      </Card.Text>
    ));
  };

  return (
    <Card
      className={styles.SearchCard}
      style={{ borderColor: 'blue' }}
    >
      <Card.Body>
        <a href={'/amenities/' + row.amen_id}>
          <u>
            <Card.Title className={styles['card-title-style']}>
              {row.amen_name}
            </Card.Title>
          </u>
        </a>
        {displayCardText(row)}
      </Card.Body>
    </Card>
  );
};

export default SearchAmenitiesCard;
