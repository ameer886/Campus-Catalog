import React from 'react';
import './University.css';

type UniversityProps = {
  id?: number;
  name?: string;
};

/*
 * The instance page for a single university
 * Should contain a list of media relevant to this university
 * Any attribute information should be passed in as a property
 */
const University: React.FunctionComponent<UniversityProps> = ({
  id,
  name = 'ERR: name not found',
}: UniversityProps) => {
  return (
    <div className="University">
      <h1>University {id ?? ' - ERR: ID not found'}</h1>
      <p>Welcome to the page for {name}</p>
    </div>
  );
};

export default University;
