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
        This location has a transit score of {aptQuery.transit_score}{' '}
        and a walk score of {aptQuery.walk_score}.
      </p>

      <p>
        We found {aptQuery.building_amenities.length} amenities at
        this location.
      </p>
      {aptQuery.building_amenities.length > 0 && (
        <div className={styles.ListContainer}>
          <ul>
            {aptQuery.building_amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>
      )}

      <p>
        <span>
          This location does {aptQuery.cat_allow ? '' : 'not '}allow
          cats.
        </span>
        {aptQuery.cat_allow && aptQuery.max_num_cat !== 0 && (
          <span>You can have up to {aptQuery.max_num_cat} cats.</span>
        )}
        {aptQuery.cat_weight != null && aptQuery.cat_allow && (
          <span>
            The maximum weight of a cat is{' '}
            {aptQuery.cat_weight || 'any weight'}.
          </span>
        )}
      </p>

      <p>
        <span>
          This location does {aptQuery.dog_allow ? '' : 'not '}allow
          dogs.
        </span>
        {aptQuery.dog_allow && aptQuery.max_num_dog !== 0 && (
          <span>You can have up to {aptQuery.max_num_dog} cats.</span>
        )}
        {aptQuery.dog_weight != null && aptQuery.dog_allow && (
          <span>
            The maximum weight of a dog is{' '}
            {aptQuery.dog_weight || 'any weight'}.
          </span>
        )}
      </p>

      <div className={styles.Splitter}>
        <div className={styles.SplitSide}>
          <p>
            We found {aptQuery.amenities_nearby.length} nearby
            entertainment amenit
            {aptQuery.amenities_nearby.length === 1 ? 'y' : 'ies'}.
          </p>
          {aptQuery.amenities_nearby.length > 0 && (
            <div>
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
          <p>
            We found {aptQuery.universities_nearby.length} nearby
            universit
            {aptQuery.universities_nearby.length === 1 ? 'y' : 'ies'}.
          </p>
          {aptQuery.universities_nearby.length > 0 && (
            <div>
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

      <p>We found these images:</p>
      {aptQuery.images.map((image, index) => (
        <img src={image} key={index} />
      ))}

      {aptQuery.location.lat && aptQuery.location.lon && (
        <>
          <p>A map of the location:</p>
          <Location
            position={{
              lat: parseFloat(aptQuery.location.lat),
              lng: parseFloat(aptQuery.location.lon),
            }}
          />
        </>
      )}
    </div>
  );
};

export default Apartment;
