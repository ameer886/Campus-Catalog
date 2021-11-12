import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { Index, InstantSearch } from 'react-instantsearch-dom';
import { SearchBox, connectHits } from 'react-instantsearch-dom';
import { connectStateResults } from 'react-instantsearch-dom';
import './Search.css';
import Navbar from '../OurNavbar/OurNavbar';
import Image from 'react-bootstrap/Image';
import WebFont from 'webfontloader';
import SearchUniversitiesCard from './SearchUniversitiesCard';
import SearchAmenitiesCard from './SearchAmenitiesCard';
import SearchHousingCard from './SearchHousingCard';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

<<<<<<< HEAD
/* creating search client for our Algolia search application */
const searchClient = algoliasearch(
  'XS3D8421D0',
  '79178e75bc60777adc2ea95bbbc4195d',
);

=======
>>>>>>> fixed search page, now has a drop down option for all models, removed algolia
/* filter type for search */
enum SearchType {
  Amenities,
  Housing,
  Universities,
  All,
}

/* custom display of the amenities results */
const amenitiesHits = ({ hits }) => (
  <div className="row">
    {hits.map((hit) => (
      <div className="search-columns" key={hit.amen_id}>
        <SearchAmenitiesCard hit={hit} />
      </div>
    ))}
  </div>
);
const CustomAmenitiesHits = connectHits(amenitiesHits);

const AmenitiesContent = connectStateResults(({ searchState }) =>
  searchState && searchState.query ? (
    <div className="content">
      <CustomAmenitiesHits />
    </div>
  ) : null,
);

/* custom display of the universities results */
const universitiesHits = ({ hits }) => (
  <div className="row">
    {hits.map((hit) => (
      <div className="search-columns" key={hit.univ_id}>
        <SearchUniversitiesCard hit={hit} />
      </div>
    ))}
  </div>
);
const CustomUniversitiesHits = connectHits(universitiesHits);

const UniversitiesContent = connectStateResults(({ searchState }) =>
  searchState && searchState.query ? (
    <div className="content">
      <CustomUniversitiesHits />
    </div>
  ) : null,
);

/* custom display of the housing results */
const housingHits = ({ hits }) => (
  <div className="row">
    {hits.map((hit) => (
      <div className="search-columns" key={hit.property_id}>
        <SearchHousingCard hit={hit} />
      </div>
    ))}
  </div>
);
const CustomHousingHits = connectHits(housingHits);

const HousingContent = connectStateResults(({ searchState }) =>
  searchState && searchState.query ? (
    <div className="content">
      <CustomHousingHits />
    </div>
  ) : null,
);

/* takes in query that the user searches and returns search results */
function Search(q: any) {
  /* type of filter and text displayed in dropdown */
  const [filterType, setFilterType] = React.useState<number>(
    SearchType.All,
  );
  const [filterTitle, setFilterTitle] =
    React.useState<string>('Filter by Model');

  /* load in fonts */
  WebFont.load({
    google: {
      families: ['serif', 'Oswald', 'sans-serif'],
    },
  });

  /* when amenities filter is clicked */
  function amenitiesOnClick() {
    setFilterType(SearchType.Amenities);
    setFilterTitle('Filter by Amenities');
  }

  /* when housing filter is clicked */
  function housingOnClick() {
    setFilterType(SearchType.Housing);
    setFilterTitle('Filter by Housing');
  }

  /* when universities filter is clicked */
  function OnClick() {
    setFilterType(SearchType.Universities);
    setFilterTitle('Filter by Universities');
  }

  /* when none filter is clicked */
  function noneOnClick() {
    setFilterType(SearchType.All);
    setFilterTitle('Filter by Model');
  }

  return (
    <div className="Search">
      <h1 className="search-heading">SEARCH RESULTS</h1>
      <h2 className="query-style">{q.q}</h2>
      <br />
      {/* display filter dropdown */}
      <DropdownButton id="dropdown-basic-button" title={filterTitle}>
        <Dropdown.Item>amenities</Dropdown.Item>
        <Dropdown.Item>All</Dropdown.Item>
      </DropdownButton>
      <br />
      <InstantSearch
        indexName="amenities_index"
        searchClient={searchClient}
        searchState={{ query: q.q }}
      >
        <div style={{ display: 'none' }}>
          <SearchBox />
        </div>
        {/* index containing all amenities data  */}
        <Index indexName="amenities_index">
          {filterType === SearchType.Amenities ||
          filterType === SearchType.All ? (
            <div>
              <h1 className="section-title">amenities</h1>
              <p className="section-subtitle">
                Learn about amenities.{' '}
              </p>
              <br />
              <main>
                <AmenitiesContent />
              </main>
            </div>
          ) : (
            <div></div>
          )}
        </Index>
      </InstantSearch>
      <br />
    </div>
  );
}

export default Search;
