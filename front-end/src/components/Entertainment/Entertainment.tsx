import React from 'react';
import './Entertainment.css';
import { EntertainmentType } from '../../views/Entertainments/EntertainmentsPage';
import { NavLink } from 'react-router-dom';

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
      <h1>{entQuery.businessName}</h1>
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
        {entQuery.delivery ?? 'there may or may not be delivery'}.
        Some universities that are close to this business are{' '}
        <NavLink to="/universities/id=1">Harvard University</NavLink>,{' '}
        <NavLink to="/universities/id=3">
          Princeton University
        </NavLink>
        , and{' '}
        <NavLink to="/universities/id=2">
          The University of Texas at Austin
        </NavLink>
        . Apartments that are located near this business include{' '}
        <NavLink to="/apartments/id=1">Parkside Place</NavLink>,{' '}
        <NavLink to="/apartments/id=3">3401 at Red River</NavLink>,
        and{' '}
        <NavLink to="/apartments/id=2">
          Barclay Square at Princeton Forrestal
        </NavLink>
        .
      </p>
    </div>
  );
};

export default Entertainment;
