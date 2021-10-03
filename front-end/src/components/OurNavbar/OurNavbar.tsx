import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './OurNavbar.css'

const OurNavbar: React.FunctionComponent = () => {
  const links = [
    {
      href: '/about',
      name: 'About',
      key: 0,
    },
    {
      href: '/apartments',
      name: 'Apartments',
      key: 1,
    },
    {
      href: '/entertainments',
      name: 'Entertainment',
      key: 2,
    },
    {
      href: '/universities',
      name: 'Universities',
      key: 3,
    },
  ];

  return (
    <Navbar sticky="top" bg="dark" variant="dark">
      <Navbar.Brand className="brand" href="/">Campus Catalog</Navbar.Brand>
      <Nav className="mr-auto">
        {links.map((link) => (
          <Nav.Link href={link.href} key={link.key}>
            {link.name}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
};
export default OurNavbar;
