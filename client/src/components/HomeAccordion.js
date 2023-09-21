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
        <Accordion.Header style={headerStyle}>Contact Dispatch List</Accordion.Header>
        <Accordion.Body style={bodyStyle}>
          <h2>Purpose</h2>
          <p>
            The Contact Dispatch List is a web page to allow for real time recording of accounts that are set up for contact dispatch. 
            This page is set up for documentation and tracking purposes.
          </p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header style={headerStyle}>Disconnect List API</Accordion.Header>
        <Accordion.Body style={bodyStyle}>
          <h2>Script Usage</h2>
          <p>
            The Disconnect List API will display to a phone agent a list of Property Owners that are customers for a specified utility provider (account number).
            If Unlisted is selected in for the Property Owner the agent will be able to select based off of street address.
          </p>
          <h2>Web Tool</h2>
          <p>
            The Web Tool for the Disconnect List API has two different modes. 
            The <strong>View</strong> mode will allow someone to review data provider from the utility provider.
            The <strong>Edit</strong> mode will allow someone to adjust all relevant data provided.
          </p>
          <h2>How to use the web tool</h2>
          <ol>
            <li>Click the Disconnect List API link in the upper right hand corner</li>
            <li>Select the account you need to edit from the drop down</li>
            <li>Click the Enable Editing button</li>
          </ol>
          <p>
            From here you will be able to add a blank row or delete a row. 
            In order to edit a Vessel or Contact you will need to click in the text box and type in your data.
            The Contact box is an Auto Complete text box that will only allow you to type/select from the drop down.
            After you are done making your edits, click the "Save and View" button below the data you have entered.<br />
            If, after saving, any fields have the red background you will need to fill that field in in order to save.<br />
            If, after saving, any fields have an orange background you will need to fill in at least one of the fields in that listing.
          </p>
          <p>
            <i>*If you want to learn how to use the web tool, select account 38 from the drop down list.</i>
          </p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header style={headerStyle}>Scheduler API</Accordion.Header>
        <Accordion.Body style={bodyStyle}>
          <h2>purpose</h2>
          <p>
            The Scheduler API is currently a work in progress. This API will be able to track available and unavailable appointment times and dates.
            The data will be auto-populated into drop down lists to allow agents to select a date then time for an appoint.
            When the date and time are selected the API Server will be updated removing that from the possible options list for appointments.
            Those times will become available again if someone calls in to cancel an appointment.
            The API Server will auto delete past dates and times whenever the API is called so that we don't send dead data to the agents.
          </p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header style={headerStyle}>Vessel API</Accordion.Header>
        <Accordion.Body style={bodyStyle}>
          <h2>Script Usage</h2>
          <p>
            The Vessel API will display to a phone agent a list of Vessels that are at a specified Marina (account number).
            When a vessel is selected, the contact that is associated with that vessel is auto pulled into the script to populate who the call is going to be.
          </p>
          <h2>Web Tool</h2>
          <p>
            The Web Tool for the Vessel API has two different modes. 
            The <strong>View</strong> mode will allow someone to review the vessels and who is currently assigned as the contact for that vessel.
            The <strong>Edit</strong> mode will allow someone to adjust the vessels that the marina has, along with who the assigned contact is for that vessel.
          </p>
          <h2>How to use the web tool</h2>
          <ol>
            <li>Click the Vessels API link in the upper right hand corner</li>
            <li>Select the account you need to edit from the drop down</li>
            <li>Click the Enable Editing button</li>
          </ol>
          <p>
            From here you will be able to add a blank row or delete a row. 
            In order to edit a Vessel or Contact you will need to click in the text box and type in your data.
            The Contact box is an Auto Complete text box that will only allow you to type/select from the drop down.
            After you are done making your edits, click the "Save and View" button below the vessels you have entered.
          </p>
          <p>
            <i>*If you want to learn how to use the web tool, select account 38 from the drop down list.</i>
          </p>
          <p>
            <i>**Proof Read by - BP</i>
          </p>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default HomeAccordion;