import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const toggleHover = () => setHovered(!hovered);

  return (  
    <>  
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Nav.Link className={hovered ? 'text-info' : 'text-success'} as={Link} to='/Vessels' onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
                Vessels API
              </Nav.Link>
              <Nav.Link className={hovered ? 'text-info' : 'text-success'} as={Link} to='/ContactDispatch' onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
                ContactDispatch List
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>  
  );
{/* set modal data up */}
};


export default AppNavbar;
