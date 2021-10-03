import React from 'react';
import './Entertainment.css';
import { EntertainmentType } from '../../views/Entertainments/EntertainmentsPage';

type EntertainmentProps = {
  entQuery: EntertainmentType;
};

/*
 * The instance page for a single entertainment building
 * Should contain a list of media relevant to this entertainment
 * Any attribute information should be passed in as a property
 */
const Entertainment: React.FunctionComponent<EntertainmentProps> = ({
  entQuery,
}: EntertainmentProps) => {
  return (
    <div className="Entertainment">
      <h1>Entertainment {entQuery.id ?? ' - ERR: ID not found'}</h1>
      <p>
        Welcome to the page for {entQuery.businessName}. It is a{' '}
        {entQuery.category} business.{' '}
      </p>
      <p>
        {' '}
        {entQuery.businessName} is located on {entQuery.location[0]},
        {entQuery.location[1]} {entQuery.location[2]}{' '}
        {entQuery.location[3]}. The age restriction is{' '}
        {entQuery.ageRestriction} and the price is {entQuery.price}.
        Is there delivery? The answer is{' '}
        {entQuery.delivery ?? 'there may or may not be delivery'}.{' '}
      </p>
    </div>
  );
};

export default Entertainment;
