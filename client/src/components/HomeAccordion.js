import Accordion from 'react-bootstrap/Accordion';

function HomeAccordion() {
  const accordionData = {
    Data: [
      {
        Title: "Crescent Electric Reach List",
        Content:
          <>
            <h2>Script Usage</h2>
            <div>
              <p>
                The Crescent Electric Reach List will act as an escalation list for the script.
              </p>
              <h2>Web Tool</h2>
              <p>
                The Web Tool for the Crescent Electric Reach List has three different modes.
              </p>
              <p>
                The <strong>View</strong> mode will allow someone to review the different branches and who is assigned to be the contact(s) for that branch.
              </p>
              <p>
                The <strong>Edit Contacts</strong> mode will allow someone to adjust the contacts for each branch.
              </p>
              <p>
                The <strong>Add a Branch</strong> mode will allow someone to add a new branch to the database for agents to be able to select.
              </p>
            </div>
            <h2>How to use the web tool</h2>
            <ol>
              <li>Click the Crescent Electric Reach List link from the menu in the upper right hand corner</li>
              <li>Select the account you need to edit from the drop down</li>
              <li>Choose either the "Edit Contacts" button or "Add a Branch" button</li>
            </ol>
            <h3>Edit Contacts</h3>
            <ul>
              <li>In the Edit Contacts view you can adjust any of the contacts listed</li>
              <li>You can edit as many contacts as documented as needing to being updated!</li>
              <li>Each Contact has an Auto-Fill drop down list that you can select from</li>
              <li>In order to select a contact they have to exist in the directory</li>
              <li>After completing the updates click the "Save All Contact Updates"</li>
              <li>If you do not wish to save your updates you can select the Exit Editing button to escape the edit screen</li>
            </ul>
            <h3>Add a Branch</h3>
            <ul>
              <li>In the Add New Branch view you will only have one row available to work in</li>
              <li>This is the only mode that allows you to add a Branch Number, State, and City</li>
              <li>The Branch, City, and State fields are all required and if you are missing any of them there will be a message above the save button</li>
              <li>Each Contact has an Auto-Fill drop down list that you can select from</li>
              <li>In order to select a contact they have to exist in the directory</li>
              <li>After filling in the required fields click the "Save New Branch"</li>
              <li>If you do not wish to save your updates you can select the Exit Editing button to escape the edit screen</li>
            </ul>
          </>
      },
      {
        Title: "Disconnect List API",
        Content:
          <>
            <h2>Script Usage</h2>
            <p>
              The Disconnect List API will display a list of Property Owners that are customers for a specified utility provider (account number) to a phone agent.
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
              <li>Click the Disconnect List API link from the menu in the upper right hand corner</li>
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
          </>
      }, 
      {
        Title: "How To",
        Content:
          <>
            <h2>Description</h2>
            <p>
              The How To page is a self-help guide. It will include information on how to do different tasks in IS Supervisor.
            </p>
            <h2>What's Included</h2>
            <ul>
              <li>Documentation: This page will include different terms that we use and what they mean</li>
              <li>Answer Phrase Guide</li>
              <li>Setting Up Status's</li>
            </ul>
          </>
      },
      {
        Title: "Info",
        Content:
        <>
          <h2>Description</h2>
          <p>
            The Info page is designed to display database data. 
            This could include Directory information, back-end Client information, and different databased information that is used in the scripts.
          </p>
          <h2>What's Included</h2>
          <ul>
            <li>Documentation: This page will include a list of every option listed below and what each option does</li>
            <li>Get Agents Supervisors</li>
            <li>Get Clients</li>
            <li>Get Client and Contacts And Roles</li>
            <li>Get Clients And Directories</li>
            <li>Get Contacts And Directories</li>
            <li>Get Databased Providers</li>
            <li>Get DID</li>
            <li>Get Directory Contacts And Info Cards</li>
            <li>Get Info Pages</li>
            <li>Get Holidays</li>
            <li>Mail Gun Failed Events</li>
          </ul>
        </>
      },
      {
        Title: "Vessel API",
        Content:
          <>
            <h2>Script Usage</h2>
            <p>
              The Vessel API will display a list of Vessels that are at a specified Marina (account number) to a phone agent.
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
              <li>Click the Vessels API link from the menu in the upper right hand corner</li>
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
          </>
      }
    ]
  }

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

  const accordionBuilder = () => {
    let elements = new Array();
    for (let i = 0; i < accordionData.Data.length; i++) {
      console.log(accordionData.Data[i]);
      elements.push(
        <Accordion.Item eventKey={`${i}`}>
          <Accordion.Header style={headerStyle}>{accordionData.Data[i].Title}</Accordion.Header>
          <Accordion.Body style={bodyStyle}>{accordionData.Data[i].Content}</Accordion.Body>
        </Accordion.Item>
      );
    }
    return elements;
  }

  return (
    <Accordion>
      {accordionBuilder()}
    </Accordion>
  );
}

export default HomeAccordion;