import React from 'react';
import './Apartment.css';

type ApartmentProps = {
  id?: number;
  name?: string;
};

/*
 * The instance page for a single apartment
 * Should contain a list of media relevant to this apartment
 * Any attribute information should be passed in as a property
 */
const Apartment: React.FunctionComponent<ApartmentProps> = ({
  id,
  name = 'ERR: name not found',
}: ApartmentProps) => {
  return (
    <div className="Apartment">
      <h1>Apartment {id ?? ' - ERR: ID not found'}</h1>
      <p>Welcome to the page for {name}</p>
    </div>
  );
};

export default Apartment;
