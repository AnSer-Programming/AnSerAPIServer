import Accordion from 'react-bootstrap/Accordion';

function HomeAccordion() {
  const accordionStyle = {
    marginBottom: '45px',
  };
  
  const headerStyle = {
    backgroundColor: '#333435',
    padding: '12px 16px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
  };
  
  const bodyStyle = {
    padding: '16px',
    backgroundColor: '#333435',
    color: 'white',
    fontFamily: 'Poppins, sans-serif',
  };
  return (
    <Accordion style={accordionStyle}> 
      <Accordion.Item eventKey="0">
        <Accordion.Header style={headerStyle}>Scheduler API</Accordion.Header>
        <Accordion.Body style={bodyStyle}>
          Work in progress
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header style={headerStyle}>Vessel API</Accordion.Header>
        <Accordion.Body style={bodyStyle}>
          Documentation coming soon!
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header style={headerStyle}>Contact Dispatch List</Accordion.Header>
        <Accordion.Body style={bodyStyle}>
          This list will display the accounts in contact dispatch along with the account type (Medical, HVAC, Realestate, etc.).
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default HomeAccordion;