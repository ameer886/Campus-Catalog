import React from 'react';
import './Apartment.css';
import { ApartmentType } from '../../views/Apartments/ApartmentsPage';

type ApartmentProps = {
  aptQuery: ApartmentType;
};

/*
 * The instance page for a single apartment
 * Should contain a list of media relevant to this apartment
 * Any attribute information should be passed in as a property
 */
const Apartment: React.FunctionComponent<ApartmentProps> = ({
  aptQuery,
}: ApartmentProps) => {
  return (
    <div className="Apartment">
      <h1>{aptQuery.property_name}</h1>
    </div>
  );
};

export default Apartment;
