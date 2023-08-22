import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = () => {
  const [vesselAPILink, setVesselAPILink] = useState(false);
  const [contactDispatListLink, setContactDispatListLink] = useState(false);

  function hoverHandler(e) {
    let id = e.target.id;
    switch(id) {
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
  );
{/* set modal data up */}
};


export default AppNavbar;
