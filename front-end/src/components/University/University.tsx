import React from 'react';
import styles from './University.module.css';
import { NavLink } from 'react-router-dom';

import { formatNumberToMoney } from '../../utilities';

import { UniversityType } from '../../views/Universities/UniversitiesPage';

type UniversityProps = {
  id: string;
};

/*
 * The instance page for a single university
 * Should contain a list of media relevant to this university
 * Any attribute information should be passed in as a property
 */
const University: React.FunctionComponent<UniversityProps> = ({
  id,
}: UniversityProps) => {
  return (
    <div>
      <p>Eventually will be university {id}.</p>
    </div>
  );
};

export default University;
