<<<<<<< HEAD
import Accordion from 'react-bootstrap/Accordion';

function BasicExample() {
  const accordionStyle = {
    marginBottom: '45px',

  };

  const headerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '12px 16px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
  };

  const bodyStyle = {
    padding: '16px',
    backgroundColor: '#333435',
    color: "white",
    fontfamily: 'Poppins, sans-serif',
  };
  return (
    <Accordion style={accordionStyle}> 
      <Accordion.Item eventKey="0">
        <Accordion.Header style={headerStyle}>Scheduler API</Accordion.Header>
        <Accordion.Body style={bodyStyle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. THis does that Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header style={headerStyle}>Vessel API</Accordion.Header>
        <Accordion.Body style={bodyStyle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
=======
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = () => {
  const [disconnectListAPILink, setDisconnectListAPILink] = useState(false);
  const [vesselAPILink, setVesselAPILink] = useState(false);
  const [contactDispatListLink, setContactDispatListLink] = useState(false);

  function hoverHandler(e) {
    let id = e.target.id;
    switch(id) {
      case "disconnectListAPI":
        setDisconnectListAPILink(!disconnectListAPILink);
        break;
      case "vesselAPI":
        setVesselAPILink(!vesselAPILink);
        break;
      case "contactDispatchList":
        setContactDispatListLink(!contactDispatListLink);
        break;
      default:
        break;
    } 
  }

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
              <Nav.Link className={disconnectListAPILink ? 'text-success' : 'text-info'} id="disconnectListAPI" as={Link} to='/DisconnectList' onMouseEnter={hoverHandler} onMouseLeave={hoverHandler}>
                Disconnect List API
              </Nav.Link>
              <Nav.Link className={vesselAPILink ? 'text-success' : 'text-info'} id="vesselAPI" as={Link} to='/Vessels' onMouseEnter={hoverHandler} onMouseLeave={hoverHandler}>
                Vessels API
              </Nav.Link>
              <Nav.Link className={contactDispatListLink ? 'text-success' : 'text-info'} id="contactDispatchList" as={Link} to='/ContactDispatch' onMouseEnter={hoverHandler} onMouseLeave={hoverHandler}>
                ContactDispatch List
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>  
>>>>>>> main
  );
}

export default BasicExample;