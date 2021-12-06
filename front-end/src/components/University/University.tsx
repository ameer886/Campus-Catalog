import React from 'react';
import { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';

import styles from './University.module.css';
import type { UniversityType } from '../../views/Universities/UniversitiesPage';
import {
  formatAddressState,
  formatNumberToMoney,
} from '../../utilities';
import { getAPI } from '../../APIClient';
import Location from '../Location/Location';
import YoutubeEmbed from '../YoutubeEmbed/YoutubeEmbed';

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
        window.location.assign('/error');
      }
    };
    fetchDataAsync();
  }, [id]);

  if (uniQuery == null)
    return (
      <div className={styles.University}>
        <p>Loading, please be patient.</p>
      </div>
    );

  const state = formatAddressState(uniQuery.location);

  return (
    <div className={styles.University}>
      <h1 className={styles.Name}>{uniQuery.univ_name}</h1>
      <h3 className={styles.Location}>{state}</h3>

      {uniQuery.rank ? (
        <p>This university is ranked {uniQuery.rank}.</p>
      ) : (
        <p>We could not find a ranking for this university.</p>
      )}

      <p>This university is a {uniQuery.ownership_id} university.</p>
      <p>
        You can find the university website{' '}
        <Nav.Link
          href={uniQuery.school_url}
          style={{ display: 'inline', padding: '0' }}
          rel="nofollower noopener"
        >
          here
        </Nav.Link>
        .
      </p>

      {uniQuery.avg_cost_attendance != null &&
      uniQuery.avg_cost_attendance !== 0 ? (
        <p>
          The average cost of attendance for this university is{' '}
          {formatNumberToMoney(uniQuery.avg_cost_attendance)}.
        </p>
      ) : (
        <p>
          We could not find the average cost of attendance for this
          university.
        </p>
      )}
      {uniQuery.tuition_in_st != null &&
      uniQuery.tuition_in_st !== 0 ? (
        <p>
          The in-state tuition for this university is{' '}
          {formatNumberToMoney(uniQuery.tuition_in_st)}.
        </p>
      ) : (
        <p>
          We could not find the in-state tuition for this university.
        </p>
      )}
      {uniQuery.tuition_out_st != null &&
      uniQuery.tuition_out_st !== 0 ? (
        <p>
          The out-of-state tuition for this university is{' '}
          {formatNumberToMoney(uniQuery.tuition_out_st)}.
        </p>
      ) : (
        <p>
          We could not find the out-of-state tuition for this
          university.
        </p>
      )}

      <p>
        {uniQuery.graduation_rate != null ? (
          <span>
            This university has a graudation rate of{' '}
            {(100 * uniQuery.graduation_rate).toFixed(1)}%.{' '}
          </span>
        ) : (
          <span>We could not find the graduation rate. </span>
        )}
        {uniQuery.num_undergrad != null ? (
          <span>
            There are {uniQuery.num_undergrad.toLocaleString('en-US')}{' '}
            undergrad students.{' '}
          </span>
        ) : (
          <span>
            We could not find the number of undergrad students.{' '}
          </span>
        )}
        {uniQuery.num_graduate != null ? (
          <span>
            There are {uniQuery.num_graduate.toLocaleString('en-US')}{' '}
            graduate students.
          </span>
        ) : (
          <span>
            We could not find the number of graduate students.
          </span>
        )}
      </p>

      <p>
        {uniQuery.avg_sat ? (
          <span>
            The average SAT score for this university is{' '}
            {uniQuery.avg_sat}.
          </span>
        ) : (
          <span>We could not find the average SAT score. </span>
        )}
        {uniQuery.acceptance_rate ? (
          <span>
            The acceptance rate
            {(100 * uniQuery.acceptance_rate).toFixed(1)}%.
          </span>
        ) : (
          <span>We could not find the acceptance rate.</span>
        )}
      </p>

      <p>Carnegie undergrad: {uniQuery.carnegie_undergrad}</p>
      <p>The locale is: {uniQuery.locale}</p>

      <div className={styles.Splitter}>
        <div className={styles.SplitSide}>
          <p>
            We found {uniQuery.amenities_nearby.length} nearby
            entertainment amenit
            {uniQuery.amenities_nearby.length === 1 ? 'y' : 'ies'}.
          </p>
          {uniQuery.amenities_nearby.length > 0 && (
            <div>
              <ul style={{ width: '100%', textAlign: 'center' }}>
                {uniQuery.amenities_nearby.map((amenity, index) => (
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
            We found {uniQuery.housing_nearby.length} nearby housing
            location
            {uniQuery.housing_nearby.length === 1 ? '' : 's'}.
          </p>
          {uniQuery.housing_nearby.length > 0 && (
            <div>
              <ul style={{ width: '100%', textAlign: 'center' }}>
                {uniQuery.housing_nearby.map((housing, index) => (
                  <li key={index}>
                    <Nav.Link
                      href={`/housing/${housing.property_id}`}
                    >
                      {housing.property_name}
                    </Nav.Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <YoutubeEmbed embedId={uniQuery.video_id} />
      <img src={uniQuery.image} />

      <p>A map of the location:</p>
      <Location
        position={{ lat: uniQuery.latitude, lng: uniQuery.longitude }}
      />
    </div>
  );
};

export default University;
