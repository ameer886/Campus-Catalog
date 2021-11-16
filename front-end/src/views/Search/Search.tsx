import React, { useEffect } from 'react';
import { useState } from 'react';
import WebFont from 'webfontloader';

import type { ApartmentRowType } from '../Apartments/ApartmentsPage';
import type { UniversityRowType } from '../Universities/UniversitiesPage';
import type { EntertainmentRowType } from '../Entertainments/EntertainmentsPage';

import SearchAmenitiesColumn from './SearchAmenitiesColumn';
import SearchHousingColumn from './SearchHousingColumn';

import { getAPI } from '../../APIClient';

import styles from './Search.module.css';
import SearchUniversitiesColumn from './SearchUniversitiesColumn';

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

export function getHighlightHTML(s: string, q: string): JSX.Element {
  const qWords = q.toLowerCase().split(' ');
  let regexString = `(?=${q})|(?<=${q})`;
  if (qWords.length > 1)
    qWords.forEach((s) => (regexString += `|(?=${s})|(?<=${s})`));

  let textArr: string[];
  try {
    textArr = s.split(new RegExp(regexString, 'ig'));
  } catch {
    textArr = [s];
  }

  const output = (
    <>
      {textArr.map((elt, index) => (
        <>
          {!(
            elt.toLowerCase() === q.toLowerCase() ||
            qWords.includes(elt.toLowerCase())
          ) && <span key={index}>{elt}</span>}
          {(elt.toLowerCase() === q.toLowerCase() ||
            qWords.includes(elt.toLowerCase())) && (
            <mark style={{ padding: 0, backgroundColor: 'yellow' }}>
              {elt}
            </mark>
          )}
        </>
      ))}
    </>
  );
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

  const [filterState, setFilterState] = useState([true, true, true]);
  const [housingRows, setHousingRows] = useState<
    Array<ApartmentRowType>
  >([]);
  const [univRows, setUnivRows] = useState<Array<UniversityRowType>>(
    [],
  );
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

        for (let i = 0; i < data.length; i++) {
          if (data[i].amenities) {
            const amenitiesData = data[i];
            const amenDataRows = amenitiesData.amenities.map(
              (amen) => {
                return {
                  id: amen.amen_id,
                  ...amen,
                };
              },
            );
            setAmenityRows(amenDataRows);
          } else if (data[i].universities) {
            const univData = data[i];
            const univDataRows = univData.universities.map((univ) => {
              return {
                id: univ.univ_id,
                ...univ,
              };
            });
            setUnivRows(univDataRows);
          } else if (data[i].properties) {
            const housingData = data[1];
            const housingDataRows = housingData.properties.map(
              (apt) => {
                return {
                  id: apt.property_id,
                  ...apt,
                };
              },
            );
            setHousingRows(housingDataRows);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDataAsync();
  }, [filterState]);

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

  return (
    <div className={styles.Search}>
      <h1 className={styles.search_heading}>SEARCH RESULTS</h1>
      <h2 className={styles.query_style}>{q}</h2>

      <h1>Select which models you would like to search from:</h1>
      <div
        className={styles.Centering}
        style={{ marginBottom: '24px' }}
      >
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

      <div className={styles.Centering}>
        {filterState[0] && (
          <SearchHousingColumn
            loading={loading}
            query={q}
            rows={housingRows}
          />
        )}
        {filterState[1] && (
          <SearchUniversitiesColumn
            loading={loading}
            query={q}
            rows={univRows}
          />
        )}
        {filterState[2] && (
          <SearchAmenitiesColumn
            loading={loading}
            query={q}
            rows={amenityRows}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
