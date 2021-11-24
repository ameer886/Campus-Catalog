import React from 'react';
import styles from './OurNavbar.module.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import WebFont from 'webfontloader';

import NavSearch from './NavSearch';

/* the navigation bar which appears on
all the pages */
const OurNavbar: React.FunctionComponent = () => {
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
        <div className={styles.NavbarSplitter}>
          <div>
            <Navbar.Brand className={styles.tabs} href="/">
              CAMPUS CATALOG
            </Navbar.Brand>
            {/* links to navbar pages */}
            <Nav
              className="mr-auto"
              style={{ display: 'inline-flex' }}
            >
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
          </div>
          <div id={styles.SearchContainer}>
            <NavSearch />;
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default OurNavbar;
