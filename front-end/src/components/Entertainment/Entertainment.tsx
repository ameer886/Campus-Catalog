import React from 'react';
import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';

import styles from './Entertainment.module.css';

import { EntertainmentType } from '../../views/Entertainments/EntertainmentsPage';
import Location from '../Location/Location';
import { getAPI } from '../../APIClient';
import { formatAddressState } from '../../utilities';

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
        console.log(data);
        setQuery({ ...data });
      } catch (err) {
        console.error(err);
      }
    };
    fetchDataAsync();
  }, [id]);

  if (entQuery == null)
    return (
      <div className={styles.Entertainment}>
        <p>Loading, please be patient.</p>
      </div>
    );

  const state = formatAddressState({
    city: entQuery.city,
    state: entQuery.state,
    zipcode: entQuery.zip_code,
  });
  const hoursList = entQuery.hours.split('\n');

  return (
    <div className={styles.Entertainment}>
      <h1 className={styles.Name}>{entQuery.amen_name}</h1>
      <h3 className={styles.Location}>{entQuery.address}</h3>
      <h3 className={styles.Location}>{state}</h3>

      <p>
        This location has a rating of {entQuery.rating} across{' '}
        {entQuery.num_review} reviews. The pricing of this location on
        Yelp is{' '}
        {entQuery.pricing === 'N/A' ? 'not listed' : entQuery.pricing}
        .
      </p>

      <p>
        This location does {entQuery.deliver ? '' : 'not '}have
        delivery. Furthermore, it does{' '}
        {entQuery.takeout ? '' : 'not '}have takeout.
      </p>

      {entQuery.categories.length > 0 && (
        <>
          <p>This location has the following categories:</p>
          <ul>
            {entQuery.categories.map((cat, index) => (
              <li key={index}>{cat}</li>
            ))}
          </ul>
        </>
      )}

      {hoursList.length > 0 && (
        <>
          <p>The hours for this location are:</p>
          <ul>
            {hoursList.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul>
        </>
      )}

      <p>We found {entQuery.num_review} reviews for this location.</p>

      <div className={styles.Splitter}>
        <div className={styles.SplitSide}>
          <p>
            We found {entQuery.housing_nearby.length} nearby housing
            location
            {entQuery.housing_nearby.length === 1 ? '' : 's'}.
          </p>
          <ul>
            {entQuery.housing_nearby.map((house, index) => (
              <li key={index}>
                <Nav.Link href={`/housing/${house.property_id}`}>
                  {house.property_name}
                </Nav.Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.SplitSide}>
          <p>
            We found {entQuery.universities_nearby.length} nearby
            universit
            {entQuery.universities_nearby.length === 1 ? 'y' : 'ies'}.
          </p>
          <ul>
            {entQuery.universities_nearby.map((university, index) => (
              <li key={index}>
                <Nav.Link
                  href={`/universities/${university.university_id}`}
                >
                  {university.university_name}
                </Nav.Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {entQuery.images.length > 0 && (
        <>
          <p>We found the following images:</p>
          {entQuery.images.map((image, index) => (
            <img src={image} key={index} />
          ))}
        </>
      )}

      <p>A map of the location:</p>
      <Location
        position={{
          lat: entQuery.latitude,
          lng: entQuery.longitude,
        }}
      />
    </div>
  );
};

export default Entertainment;
