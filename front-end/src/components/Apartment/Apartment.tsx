import React from 'react';
import './Apartment.css';
import { ApartmentType } from '../../views/Apartments/ApartmentsPage';
import { formatNumberToMoney } from '../../utilities';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

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
      <h1>Apartment {aptQuery.id ?? ' - ERR: ID not found'}</h1>
      <p>
        Welcome to the page for Apartment {aptQuery.id}. This
        apartment is {aptQuery.propertyName}. It is located at{' '}
        {aptQuery.location[0]}. It is in the city{' '}
        {aptQuery.location[1]},{aptQuery.location[2]}. It has the zip
        code {aptQuery.location[3]}. The minimum rent is{' '}
        {formatNumberToMoney(aptQuery.minRent)} and the maximum rent
        is {formatNumberToMoney(aptQuery.maxRent)}. It has{' '}
        {aptQuery.beds} beds, {aptQuery.baths} baths, and is{' '}
        {aptQuery.sqft} big. Is it pet friendly? The answer is{' '}
        {aptQuery.petFriendly}. Close by entertainment includes:{' '}
        <NavLink to="/entertainments/id=1">
          Mozarts Coffee Roaters
        </NavLink>
        ,<NavLink to="/entertainments/id=2">Target</NavLink>, and{' '}
        <NavLink to="/entertainments/id=3">Lan Ramen</NavLink>. Some
        universities that are close to this apartment are{' '}
        <NavLink to="/universities/id=1">Harvard University</NavLink>,{' '}
        <NavLink to="/universities/id=3">
          Princeton University
        </NavLink>
        , and{' '}
        <NavLink to="/universities/id=2">
          The University of Texas at Austin
        </NavLink>
        .
      </p>

      <p>The available amenities are:</p>

      {aptQuery.amenities && (
        <ul>
          {aptQuery.amenities.map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      )}

      <p>
        The rating for this apartment is: {aptQuery.rating}. The walk
        score for this apartment is {aptQuery.walkScore}, and the
        transit score for this apartment is {aptQuery.transitScore}.
      </p>
    </div>
  );
};

export default Apartment;
