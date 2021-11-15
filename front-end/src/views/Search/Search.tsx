import React from 'react';
import { useState } from 'react';
import styles from './Search.module.css';
import WebFont from 'webfontloader';

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

  const [filterState, setFilterState] = useState([true, true, true]);
  console.log(getQueryFromFilter(filterState));

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
    return {
      border: filterState[i] ? '2px solid cyan' : '1px solid #aaa',
    };
  };

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
