import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

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
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Campus Catalog</Navbar.Brand>

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
