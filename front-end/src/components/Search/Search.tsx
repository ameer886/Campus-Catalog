import React from "react";
import algoliasearch from "algoliasearch/lite";
import { Index, InstantSearch } from "react-instantsearch-dom";
import { SearchBox, connectHits } from "react-instantsearch-dom";
import { connectStateResults } from "react-instantsearch-dom";
import "./Search.css";
import Navbar from "../OurNavbar/OurNavbar";
import Image from "react-bootstrap/Image";
import WebFont from "webfontloader";
import SearchUniversitiesCard from "./SearchUniversitiesCard";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

/* creating search client for our Algolia search application */
const searchClient = algoliasearch(
  "JLYMGSLKAK",
  "5f470a089f411bfb08d7651de14a2987"
);

/* filter type for search */
enum SearchType {
  Universities,
  All,
}

/* custom display of the cities results */
const UniversitiesHits = ({ hits }) => (
  <div className="row">
    {hits.map((hit) => (
      <div className="search-columns" key={hit.univ_id}>
        <SearchUniversitiesCard hit={hit} />
      </div>
    ))}
  </div>
);
const CustomUniversitiesHits = connectHits(UniversitiesHits);

const UniversitiesContent = connectStateResults(({ searchState }) =>
searchState && searchState.query ? (
  <div className="content">
    <CustomUniversitiesHits />
  </div>
) : null
);


/* takes in query that the user searches and returns search results */
function Search(q: any) {

  /* type of filter and text displayed in dropdown */
  const [filterType, setFilterType] = React.useState<number>(SearchType.All);
  const [filterTitle, setFilterTitle] = React.useState<String>(
    "Filter by Model"
  );

  /* load in fonts */
  WebFont.load({
    google: {
      families: ["serif", "Raleway", "sans-serif"],
    },
  });

  /* when cities filter is clicked */
  function universitiesOnClick() {
    setFilterType(SearchType.Universities);
    setFilterTitle("Filter by Universities");
  }

  /* when none filter is clicked */
  function noneOnClick() {
    setFilterType(SearchType.All);
    setFilterTitle("Filter by Model");
  }

  return (
    <div className="Search">
      <Navbar singleColor={true} />
      <h1 className="search-heading">SEARCH RESULTS</h1>
      <h2 className="query-style">{q.q}</h2>
      <br />
      {/* display filter dropdown */}
      <DropdownButton id="dropdown-basic-button" title={filterTitle}>
        <Dropdown.Item onClick={universitiesOnClick}>Universities</Dropdown.Item>
        <Dropdown.Item onClick={noneOnClick}>All</Dropdown.Item>
      </DropdownButton>
      <br />
      <InstantSearch
        indexName="universities_index"
        searchClient={searchClient}
        searchState={{query: q.q,}}>

        <div style={{ display: "none" }}><SearchBox /></div>
        {/* index containing all cities data  */}
        <Index indexName="universities_index">
          {filterType === SearchType.Universities ||
          filterType === SearchType.All ? (
            <div>
              <h1 className="section-title">Universities</h1>
              <p className="section-subtitle">
                Learn about climate change in universities around the world.{" "}
              </p><br />
              <main><UniversitiesContent /></main>
            </div>) : (<div></div>)}
        </Index>

      </InstantSearch>
      {/* display algolia logo */}
      <div className="search-side-by-side">
        <div>Powered by &nbsp;</div>
        <div>
          <Image
            src={require("../../../assets/algolialogo.png")}
            height="5%"
            width="5%"/>
        </div>
      </div>
      <br />
    </div>
  );
}

export default Search;
