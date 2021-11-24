import React, { useEffect } from 'react';
import { useState } from 'react';
import WebFont from 'webfontloader';

import type { ApartmentRowType } from '../Apartments/ApartmentsPage';
import type { UniversityRowType } from '../Universities/UniversitiesPage';
import type { EntertainmentRowType } from '../Entertainments/EntertainmentsPage';

import SearchAmenitiesColumn from './SearchAmenitiesColumn';
import SearchHousingColumn from './SearchHousingColumn';
import SearchUniversitiesColumn from './SearchUniversitiesColumn';
import PaginationRelay from '../../components/Pagination/PaginationRelay';

import { getAPI } from '../../APIClient';

import styles from './Search.module.css';

const OPTIONS = ['Housing', 'Universities', 'Amenities'];
const PAGE_SIZE = 8;

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
      {textArr.map((elt, index) => {
        const shouldMark =
          elt.toLowerCase() === q.toLowerCase() ||
          qWords.includes(elt.toLowerCase());
        const interior = shouldMark ? (
          <mark style={{ padding: 0, backgroundColor: 'yellow' }}>
            {elt}
          </mark>
        ) : (
          elt
        );
        return <span key={index}>{interior}</span>;
      })}
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
  const [page, setPage] = useState(1);
  const [maxResult, setMaxResult] = useState(0);

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
        let params = `q=${q}&${getQueryFromFilter(filterState)}`;
        if (filterState[0])
          params += `&housing_page=${page}&housing_per_page=${PAGE_SIZE}`;
        if (filterState[1])
          params += `&universities_page=${page}&universities_per_page=${PAGE_SIZE}`;
        if (filterState[2])
          params += `&amenities_page=${page}&amenities_per_page=${PAGE_SIZE}`;

        const data = await getAPI({
          model: 'search',
          params: params,
        });

        let maxElts = 0;
        for (let i = 0; i < data.length; i++) {
          maxElts = Math.max(maxElts, data[i].total_items);
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
        setMaxResult(maxElts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        window.location.assign('/error');
      }
    };

    fetchDataAsync();
  }, [filterState, page]);

  const toggleItem = (i: number) => {
    let count = 0;
    filterState.forEach((v) => {
      if (v) count++;
    });
    if (count === 1 && filterState[i]) return;

    const copy = JSON.parse(JSON.stringify(filterState));
    copy[i] = !copy[i];
    setFilterState(copy);
    setPage(1);
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

      <PaginationRelay
        curPage={page}
        setPage={(e) => {
          setPage(e);
          setLoading(true);
        }}
        pageSize={PAGE_SIZE}
        totalElements={maxResult}
      />
    </div>
  );
};

export default Search;
