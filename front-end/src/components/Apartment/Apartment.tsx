import React from 'react';
import './Apartment.css';
import { ApartmentsType } from '../../views/Apartments/ApartmentsPage';


type ApartmentProps = {
  aptQuery: ApartmentsType;
};

/*
 * The instance page for a single apartment
 * Should contain a list of media relevant to this apartment
 * Any attribute information should be passed in as a property
 */
const Apartment: React.FunctionComponent<ApartmentProps> = ({
 aptQuery
}: ApartmentProps) => {
  return (
    <div className="Apartment">
      <h1>Apartment {aptQuery.id ?? ' - ERR: ID not found'}</h1>
      <p>Welcome to the page for {name}</p>
    </div>
  );
};

export default Apartment;
