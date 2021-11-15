import React from 'react';
import { Card } from 'react-bootstrap';

import type { ApartmentRowType } from '../Apartments/ApartmentsPage';

import { getHighlightHTML } from './Search';

import styles from './Search.module.css';

/* attributes of a city */
const housing_attributes = [
  {
    name: 'Name:',
    attribute: 'property_name',
  },
  {
    name: 'City:',
    attribute: 'city',
  },
  {
    name: 'State:',
    attribute: 'state',
  },
];

type HousingCardProps = {
  row: ApartmentRowType;
  query: string;
};

const SearchHousingCard: React.FunctionComponent<HousingCardProps> =
  ({ row, query }: HousingCardProps) => {
    /* map the attribute data to text in the card */
    const displayCardText = (row: ApartmentRowType) => {
      return housing_attributes.map((property, index) => (
        <Card.Text className="card-text-style" key={index}>
          <b>{property.name} </b>
          {getHighlightHTML(
            row[property.attribute].toString(),
            query,
          )}
        </Card.Text>
      ));
    };

    return (
      <Card
        className={styles.SearchCard}
        style={{ borderColor: 'red' }}
      >
        <Card.Body>
          <a href={'/housing/' + row.property_id}>
            <u>
              <Card.Title className={styles['card-title-style']}>
                {row.property_name}
              </Card.Title>
            </u>
          </a>
          {displayCardText(row)}
        </Card.Body>
      </Card>
    );
  };
export default SearchHousingCard;
