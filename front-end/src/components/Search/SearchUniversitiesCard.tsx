import React from 'react';
import './Search.css';
import { Card } from 'react-bootstrap';
import { Highlight } from 'react-instantsearch-dom';

/* displays card for a city result
in the search page */
function SearchUniversitiesCard(props: any) {
  /* attributes of a city */
  const university_attributes = [
    {
      name: 'Name:',
      attribute: 'univ_name',
      attribute_id: 0,
    },
    {
      name: 'Number of Undergrad Students:',
      attribute: 'num_undergrad',
      attribute_id: 1,
    },
    {
      name: 'School URL:',
      attribute: 'school_url',
      attribute_id: 2,
    },
    {
      name: 'Locale:',
      attribute: 'locale',
      attribute_id: 3,
    },
    {
      name: 'Acceptance Rate:',
      attribute: 'acceptance_rate',
      attribute_id: 4,
    },
    {
      name: 'Average SAT:',
      attribute: 'avg_sat',
      attribute_id: 5,
    },
  ];

  /* map the attribute data to text in the card */
  const displayCardText = () => {
    return university_attributes.map((university) => (
      <Card.Text
        className="card-text-style"
        key={university.attribute_id}
      >
        <b>{university.name} </b>
        <Highlight
          attribute={university.attribute}
          tagName="mark"
          hit={props.hit}
        />
      </Card.Text>
    ));
  };

  return (
    <Card>
      <Card.Body>
        <a href={'/universities/id=' + props.hit.univ_id}>
          <u>
            <Card.Title className="card-title-style">
              {props.hit.univ_name}
            </Card.Title>
          </u>
        </a>
        {displayCardText()}
      </Card.Body>
    </Card>
  );
}
export default SearchUniversitiesCard;
