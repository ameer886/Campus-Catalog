import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import WebFont from 'webfontloader';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect } from 'react';

/* the navigation bar which appears on
all the pages */
const OurNavbar = (props: any) => {
  /* input for search bar */
  const textInput: any = React.useRef();

  /* used when pressing search button in navbar */
  function searchOnClick() {
    window.location.assign('/search/q=' + textInput.current.value);
  }

  /* load the fonts */
  WebFont.load({
    google: {
      families: ['Oswald', 'sans-serif', 'Prompt'],
    },
  });

  /* for navbar tabs */
  const styles = {
    tabs: {
      color: 'white',
      fontFamily: 'Oswald',
      fontSize: '1.1vw',
      display: 'flex',
      float: 'right',
    } as React.CSSProperties,
    searchButton: {
      backgroundColor: 'white',
      borderColor: 'white',
      color: 'black',
      fontSize: '1.1vw',
    } as React.CSSProperties,
  };

  /* the navbar tabs */
  const tabs = [
    {
      href: '/about',
      name: 'ABOUT',
      key: 0,
    },
    {
      href: '/housing',
      name: 'HOUSING',
      key: 1,
    },
    {
      href: '/amenities',
      name: 'AMENITIES',
      key: 2,
    },
    {
      href: '/universities',
      name: 'UNIVERSITIES',
      key: 3,
    },
  ];

  return (
    <div className="OurNavbar">
      <Navbar sticky="top" bg="dark" variant="dark">
        {/* links to navbar pages */}
        <Nav className="mr-auto">
          {tabs.map((tab) => (
            <Nav.Link href={tab.href} key={tab.key}>
              <div style={styles.tabs}>{tab.name} &nbsp;</div>
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
          <InputGroup>
            {/* search bar */}
            <FormControl
              className="mr-sm-2"
              type="text"
              placeholder="Search"
              ref={textInput}
              style={{ fontSize: '1.1vw' }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  searchOnClick();
                }
              }}
            />
            {/* search button */}
            <InputGroup.Append style={{ fontSize: '1.1vw' }}>
              <Button
                style={styles.searchButton}
                variant="info"
                onClick={() => searchOnClick()}
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
