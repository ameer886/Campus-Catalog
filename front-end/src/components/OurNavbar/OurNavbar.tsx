import React from 'react';
import styles from './OurNavbar.module.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import WebFont from 'webfontloader';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

/* the navigation bar which appears on
all the pages */
const OurNavbar: React.FunctionComponent = () => {
  /* input for search bar */
  const [query, setQuery] = useState('');

  function search() {
    if (query.length > 0) {
      window.location.assign(`/search/q=${query}`);
    }
  }

  /* load the fonts */
  WebFont.load({
    google: {
      families: ['Oswald', 'sans-serif', 'Prompt'],
    },
  });

  /* the navbar tabs */
  const tabs = [
    {
      href: '/about',
      name: 'ABOUT',
    },
    {
      href: '/housing',
      name: 'HOUSING',
    },
    {
      href: '/amenities',
      name: 'AMENITIES',
    },
    {
      href: '/universities',
      name: 'UNIVERSITIES',
    },
  ];

  return (
    <div className="OurNavbar">
      <Navbar sticky="top" bg="dark" variant="dark">
        <Navbar.Brand className={styles.tabs} href="/">
          CAMPUS CATALOG
        </Navbar.Brand>

        {/* links to navbar pages */}
        <Nav className="mr-auto">
          {tabs.map((tab, index) => (
            <Nav.Link
              className={styles.tabs}
              href={tab.href}
              key={index}
            >
              {tab.name} &nbsp;
            </Nav.Link>
          ))}
        </Nav>

        {/* saves query when user clicks enter or "search" button */}
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
              style={{ fontSize: '1.1vw', float: 'right' }}
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
                className={styles.searchButton}
                variant="info"
                onClick={() => search()}
              >
                <AiOutlineSearch />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </Navbar>
    </div>
  );
};

export default OurNavbar;
