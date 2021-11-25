import React from 'react';
import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { AiOutlineSearch } from 'react-icons/ai';

import styles from './OurNavbar.module.css';

const NavSearch: React.FunctionComponent = () => {
  /* input for search bar */
  const [query, setQuery] = useState('');

  function search() {
    if (query.length > 0) {
      window.location.assign(`/search/q=${query}`);
    }
  }

  return (
    <Form
      inline
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <InputGroup className={styles.bar}>
        {/* search bar */}
        <FormControl
          type="text"
          placeholder="Search"
          id={styles.SearchControl}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              search();
            }
          }}
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* search button */}
        <InputGroup.Append style={{ fontSize: '1.1vw' }}>
          <Button
            variant="info"
            onClick={() => search()}
            id={styles.SearchButton}
          >
            <AiOutlineSearch />
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default NavSearch;
