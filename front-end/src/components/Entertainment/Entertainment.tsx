import React from 'react';
import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';

import styles from './Entertainment.module.css';

import { EntertainmentType } from '../../views/Entertainments/EntertainmentsPage';
import Location from '../Location/Location';
import { getAPI } from '../../APIClient';
import { formatAddressState } from '../../utilities';

type EntertainmentProps = {
  id: string;
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
          id: id,
        });
        console.log(data);
        setQuery({ ...data });
      } catch (err) {
        console.error(err);
        window.location.assign('/error');
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

      <div className={styles.middleText}>
        <p>
          This location has a rating of {entQuery.rating} across{' '}
          {entQuery.num_review} reviews. The pricing of this location
          on Yelp is{' '}
          {entQuery.pricing === 'N/A'
            ? 'not listed'
            : entQuery.pricing}
          .
        </p>

        <p>
          This location does {entQuery.deliver ? '' : 'not '}have
          delivery. Furthermore, it does{' '}
          {entQuery.takeout ? '' : 'not '}have takeout.
        </p>
      </div>

      <div className={styles.ul}>
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
      </div>
      <div className={styles.labels}>
        <p>
          We found {entQuery.num_review} reviews for this location.
        </p>
      </div>
      <div className={styles.ul}>
        {entQuery.reviews.map((review, index) => {
          console.log(review);
          return (
            <span
              className="yelp-review"
              data-review-id={review.review_id}
              data-hostname="www.yelp.com"
              key={index}
            >
              Read{' '}
              <Nav.Link
                className={styles.InlineLink}
                href={`https://www.yelp.com/user_details?userid=${review.user_id}`}
                rel="nofollow noopener"
              >
                {review.user_name}
              </Nav.Link>
              &#39;s{' '}
              <Nav.Link
                className={styles.InlineLink}
                href={`https://www.yelp.com/biz/${entQuery.yelp_id}?hrid=${review.review_id}`}
                rel="nofollow noopener"
              >
                review
              </Nav.Link>{' '}
              of{' '}
              <Nav.Link
                className={styles.InlineLink}
                href={`https://www.yelp.com/biz/${entQuery.yelp_id}`}
                rel="nofollow noopener"
              >
                {entQuery.amen_name}
              </Nav.Link>{' '}
              on{' '}
              <Nav.Link
                className={styles.InlineLink}
                href="https://www.yelp.com"
                rel="nofollow noopener"
              >
                Yelp
              </Nav.Link>
              <br></br>
              <script
                src="https://www.yelp.com/embed/widgets.js"
                type="text/javascript"
                async
              ></script>
            </span>
          );
        })}
      </div>

      <div className={styles.Splitter} style={{ marginTop: '8px' }}>
        <div className={styles.SplitSide}>
          <div className={styles.labels}>
            <p>
              We found {entQuery.housing_nearby.length} nearby housing
              location
              {entQuery.housing_nearby.length === 1 ? '' : 's'}.
            </p>
          </div>
          <div className={styles.ul}>
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
        </div>

        <div className={styles.SplitSide}>
          <div className={styles.labels}>
            <p>
              We found {entQuery.universities_nearby.length} nearby
              universit
              {entQuery.universities_nearby.length === 1
                ? 'y'
                : 'ies'}
              .
            </p>
          </div>
          <div className={styles.ul}>
            <ul>
              {entQuery.universities_nearby.map(
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
        </div>
      </div>

      {entQuery.images.length > 0 && (
        <div className={styles.imgCols}>
          {entQuery.images.map((image, index) => (
            <img src={image} key={index} />
          ))}
        </div>
      )}
      <div className={styles.map}>
        <Location
          position={{
            lat: entQuery.latitude,
            lng: entQuery.longitude,
          }}
        />
      </div>
    </div>
  );
};

export default Entertainment;
