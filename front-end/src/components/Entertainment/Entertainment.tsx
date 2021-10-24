import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Image from 'react-bootstrap/Image';

import './Entertainment.css';

import { EntertainmentType } from '../../views/Entertainments/EntertainmentsPage';
import Location from '../Location/Location';
import { getAPI } from '../../APIClient';

type EntertainmentProps = {
  id: number;
};

/*
 * The instance page for a single entertainment building
 * Should contain a list of media relevant to this entertainment
 * Any attribute information should be passed in as a property
 */
const Entertainment: React.FunctionComponent<EntertainmentProps> = ({
  id,
}: EntertainmentProps) => {
  const [entQuery, setQuery] = useState<EntertainmentType | null>(
    null,
  );

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await getAPI({
          model: 'amenities',
          id: id.toString(),
        });
        setQuery({ ...data });
      } catch (err) {
        console.error(err);
      }
    };
    fetchDataAsync();
  }, [id]);

  if (entQuery == null)
    return (
      <div>
        <p>Loading, please be patient.</p>
      </div>
    );

  return (
    <div>
      <p>Found response {JSON.stringify(entQuery)}.</p>
    </div>
  );
};

export default Entertainment;
