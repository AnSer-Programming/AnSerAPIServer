import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

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
              {/* <Nav.Link as={Link} to='/'>
                Search For API
              </Nav.Link> */}
              <Nav.Link as={Link} to='/Vessels'>
                Vessels API
              </Nav.Link>
              <Nav.Link as={Link} to='/ContactDispatch'>
                ContactDispatch API
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
