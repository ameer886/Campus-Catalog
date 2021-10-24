import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './University.module.css';
import type { UniversityType } from '../../views/Universities/UniversitiesPage';
import { formatNumberToMoney } from '../../utilities';
import { getAPI } from '../../APIClient';
import Location from '../Location/Location';

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
  const [uniQuery, setQuery] = useState<UniversityType | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await getAPI({ model: 'universities', id: id });
        setQuery({ ...data });
      } catch (err) {
        console.error(err);
      }
    };
    fetchDataAsync();
  }, [id]);

  if (uniQuery == null)
    return (
      <div className={styles.Centering}>
        <p>Loading, please be patient.</p>
      </div>
    );

  return (
    <div>
      <p>Recieved response: {JSON.stringify(uniQuery)}.</p>
    </div>
  );
};

export default University;
