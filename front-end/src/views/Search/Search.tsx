import React, { useEffect } from 'react';
import { useState } from 'react';
import WebFont from 'webfontloader';

import type { ApartmentRowType } from '../Apartments/ApartmentsPage';
// import type { UniversityRowType } from '../Universities/UniversitiesPage';
import type { EntertainmentRowType } from '../Entertainments/EntertainmentsPage';

import { getAPI } from '../../APIClient';

import styles from './Search.module.css';

const OPTIONS = ['Housing', 'Universities', 'Amenities'];

type SearchProps = {
  q: string;
};

function getQueryFromFilter(filter: Array<boolean>): string {
  let output = 'model=';
  if (filter[0]) output += OPTIONS[0];
  if (filter[1]) {
    if (output.slice(-1) !== '=') output += ',';
    output += OPTIONS[1];
  }
  if (filter[2]) {
    if (output.slice(-1) !== '=') output += ',';
    output += OPTIONS[2];
  }
  return output;
}

/* takes in query that the user searches and returns search results */
const Search: React.FunctionComponent<SearchProps> = ({
  q,
}: SearchProps) => {
  /* load in fonts */
  WebFont.load({
    google: {
      families: ['serif', 'Oswald', 'sans-serif'],
    },
  });
  const [loading, setLoading] = useState(true);

  const [filterState, setFilterState] = useState([true, false, true]);
  const [housingRows, setHousingRows] = useState<
    Array<ApartmentRowType>
  >([]);
  // TODO: universities not yet available
  /*
  const [univRows, setUnivRows] = useState<Array<UniversityRowType>>(
    [],
  );
  */
  const [amenityRows, setAmenityRows] = useState<
    Array<EntertainmentRowType>
  >([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const params = `q=${q}&${getQueryFromFilter(filterState)}`;

        const data = await getAPI({
          model: 'search',
          params: params,
        });
        const amenitiesData = data[0];
        const amenDataRows = amenitiesData.amenities.map((amen) => {
          return {
            id: amen.amen_id,
            ...amen,
          };
        });

        const housingData = data[1];
        const housingDataRows = housingData.properties.map((apt) => {
          return {
            id: apt.property_id,
            ...apt,
          };
        });

        setAmenityRows(amenDataRows);
        setHousingRows(housingDataRows);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDataAsync();
  }, [filterState]);
  console.log(amenityRows);
  console.log(housingRows);

  const toggleItem = (i: number) => {
    let count = 0;
    filterState.forEach((v) => {
      if (v) count++;
    });
    if (count === 1 && filterState[i]) return;

    const copy = JSON.parse(JSON.stringify(filterState));
    copy[i] = !copy[i];
    setFilterState(copy);
  };

  const buildStyle = (i: number) => {
    let color = 'red';
    if (i == 1) color = 'green';
    if (i == 2) color = 'blue';
    return {
      border: filterState[i]
        ? '2px solid ' + color
        : '1px solid #aaa',
    };
  };

  if (loading) return <p>Loading, please wait.</p>;

  return (
    <div className={styles.Search}>
      <h1 className={styles.search_heading}>SEARCH RESULTS</h1>
      <h2 className={styles.query_style}>{q}</h2>

      <h1>Select which models you would like to search from:</h1>
      <div style={{ display: 'flex' }}>
        {OPTIONS.map((name, index) => (
          <div
            key={index}
            onClick={() => toggleItem(index)}
            className={styles.ModelButton}
            style={buildStyle(index)}
          >
            <h2>{name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
