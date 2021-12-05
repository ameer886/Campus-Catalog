import React from 'react';
import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';

import styles from './Apartment.module.css';

import { ApartmentType } from '../../views/Apartments/ApartmentsPage';
import { getAPI } from '../../APIClient';
import {
  formatAddressState,
  formatNumberToMoney,
} from '../../utilities';
import Location from '../Location/Location';

type ApartmentProps = {
  id: string;
};

/*
 * The instance page for a single apartment
 * Should contain a list of media relevant to this apartment
 * Any attribute information should be passed in as a property
 */
const Apartment: React.FunctionComponent<ApartmentProps> = ({
  id,
}: ApartmentProps) => {
  const [aptQuery, setQuery] = useState<ApartmentType | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await getAPI({ model: 'housing', id: id });
        setQuery({ ...data });
      } catch (err) {
        console.error(err);
        window.location.assign('/error');
      }
    };
    fetchDataAsync();
  }, [id]);

  if (aptQuery == null)
    return (
      <div className={styles.Apartment}>
        <p>Loading, please be patient.</p>
      </div>
    );

  const nbd = `${aptQuery.location.neighborhood}, ${aptQuery.location['street address']}`;
  const state = formatAddressState(aptQuery.location);
  aptQuery.amenities_nearby = aptQuery.amenities_nearby.filter(
    (amenity) => amenity.amenity_id != null,
  );

  return (
    <div className={styles.Apartment}>
      <h1 className={styles.Name}>{aptQuery.property_name}</h1>
      {aptQuery.location.neighborhood &&
        aptQuery.location['street address'] && (
          <h3 className={styles.Location}>{nbd}</h3>
        )}
      <h3 className={styles.Location}>{state}</h3>

      <div className={styles.middleText}>
        <p>
          This location is a {aptQuery.property_type} with a rating of{' '}
          {aptQuery.rating}.
        </p>

        <p>
          The price of this location ranges from{' '}
          {formatNumberToMoney(aptQuery.rent.min)} to{' '}
          {formatNumberToMoney(aptQuery.rent.max)}. Utilities are
          {aptQuery.util_included ? '' : ' not'} included.
        </p>

        <p>
          The available beds range from {aptQuery.bed.min} to{' '}
          {aptQuery.bed.max}.
        </p>
        <p>
          The available baths range from {aptQuery.bath.min} to{' '}
          {aptQuery.bath.max}.
        </p>
        <p>
          The square footage available ranges from {aptQuery.sqft.min}{' '}
          to {aptQuery.sqft.max}.
        </p>

        <p>
          This location has a transit score of{' '}
          {aptQuery.transit_score} and a walk score of{' '}
          {aptQuery.walk_score}.
        </p>
      </div>

      <div className={styles.labels}>
        <p>
          We found <b>{aptQuery.building_amenities.length}</b>{' '}
          amenities at this location.
        </p>
      </div>
      {aptQuery.building_amenities.length > 0 && (
        <div className={styles.ListContainer}>
          <div className={styles.ul}>
            {aptQuery.building_amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </div>
        </div>
      )}

      <div className={styles.middleText}>
        <p>
          <span>
            This location does{' '}
            <b>{aptQuery.cat_allow ? '' : 'not '} </b>allow cats.
          </span>
          {aptQuery.cat_allow && aptQuery.max_num_cat !== 0 && (
            <span>
              You can have up to <b>{aptQuery.max_num_cat}</b> cats.
            </span>
          )}
          {aptQuery.cat_weight != null && aptQuery.cat_allow && (
            <span>
              The maximum weight of a cat is{' '}
              <b>{aptQuery.cat_weight || 'any weight'}</b>.
            </span>
          )}
        </p>

        <p>
          <span>
            This location does{' '}
            <b>{aptQuery.dog_allow ? '' : 'not '}</b>allow dogs.
          </span>
          {aptQuery.dog_allow && aptQuery.max_num_dog !== 0 && (
            <span>
              You can have up to <b>{aptQuery.max_num_dog}</b> dogs.
            </span>
          )}
          {aptQuery.dog_weight != null && aptQuery.dog_allow && (
            <span>
              The maximum weight of a dog is{' '}
              <b>{aptQuery.dog_weight || 'any weight'}</b>.
            </span>
          )}
        </p>
      </div>

      <div className={styles.Splitter}>
        <div className={styles.SplitSide}>
          <div className={styles.labels}>
            <p>
              We found <b>{aptQuery.amenities_nearby.length}</b>{' '}
              nearby entertainment amenit
              {aptQuery.amenities_nearby.length === 1 ? 'y' : 'ies'}.
            </p>
          </div>
          {aptQuery.amenities_nearby.length > 0 && (
            <div className={styles.ul}>
              <ul style={{ width: '100%', textAlign: 'center' }}>
                {aptQuery.amenities_nearby.map((amenity, index) => (
                  <li key={index}>
                    <Nav.Link
                      href={`/amenities/${amenity.amenity_id}`}
                    >
                      {amenity.amenity_name}
                    </Nav.Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.SplitSide}>
          <div className={styles.labels}>
            <p>
              We found <b>{aptQuery.universities_nearby.length}</b>{' '}
              nearby universit
              {aptQuery.universities_nearby.length === 1
                ? 'y'
                : 'ies'}
              .
            </p>
          </div>
          {aptQuery.universities_nearby.length > 0 && (
            <div className={styles.ul}>
              <ul style={{ width: '100%', textAlign: 'center' }}>
                {aptQuery.universities_nearby.map(
                  (university, index) => (
                    <li key={index}>
                      <Nav.Link
                        href={`/universities/${university.university_id}`}
                      >
                        {university.university_name}
                      </Nav.Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className={styles.imgCols}>
        {aptQuery.images.map((image, index) => (
          <img src={image} key={index} />
        ))}
      </div>

      {aptQuery.location.lat && aptQuery.location.lon && (
        <div className={styles.map}>
          <Location
            position={{
              lat: parseFloat(aptQuery.location.lat),
              lng: parseFloat(aptQuery.location.lon),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Apartment;
