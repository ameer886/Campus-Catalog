import React from 'react';
import './Entertainment.css';

type EntertainmentProps = {
  id?: number;
  name?: string;
};

/*
 * The instance page for a single entertainment building
 * Should contain a list of media relevant to this entertainment
 * Any attribute information should be passed in as a property
 */
const Entertainment: React.FunctionComponent<EntertainmentProps> = ({
  id,
  name = 'ERR: name not found',
}: EntertainmentProps) => {
  return (
    <div className="Entertainment">
      <h1>Entertainment {id ?? ' - ERR: ID not found'}</h1>
      <p>Welcome to the page for {name}</p>
    </div>
  );
};

export default Entertainment;
