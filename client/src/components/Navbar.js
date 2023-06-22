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
  );
}

export default BasicExample;