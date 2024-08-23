import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';

const DocumentationPage = () => {
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
    fontFamily: 'Tahoma, sans-serif',
  };

  return (
    <>
      <h2>Click on the option that you want more information on.</h2>
      <p>
        All information on this website comes from IS and the Intellegent Database.
        If there are missing directories or accounts verify that they exist in IS then send in a support ticket under the Type API tag.
        Assign to Stephen Merki until further notice
      </p>
      <Accordion style={accordionStyle}>
        <Accordion.Item eventKey="0">
          <Accordion.Header style={headerStyle}>Get Agents Supervisors</Accordion.Header>
          <Accordion.Body style={bodyStyle}>
            <p>On this page you will be able to view all of our Agents and who their Supervisor is!</p>
            <p>Filter Options are:</p>
            <ul>
              <li>Page Number: Use this option to quickly jump to a specific page.</li>
              <li>Agent Name: Enter the agent's name in this field to view who their assigned supervisor is.</li>
              <li>Supervisor Name: Enter the Supervisor's name to view all agents that are under that supervisor.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header style={headerStyle}>Get Clients</Accordion.Header>
          <Accordion.Body style={bodyStyle}>
            <p>On this page you will be able to view all of our Accounts! This page is designed to be very responsive to user input.</p>
            <p>Information that you will get:</p>
            <ul>
              <li>Account Number (Client Number)</li>
              <li>Client Name (Client)</li>
              <li>Client Region (Region)</li>
              <li>Client Start Date (Start Date)</li>
            </ul>
            <p>Filter Options are:</p>
            <ul>
              <li>Page Number: Use this option to quickly jump to a specific page.</li>
              <li>Account Number: Enter the Account Number for the account that you are looking for. Page updates as you type in your filter.</li>
              <li>Account Name: Enter the Account Name for the account that you are looking for. Page updates as you type in your filter.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header style={headerStyle}>Get Clients and Directories</Accordion.Header>
          <Accordion.Body style={bodyStyle}>
            <p>On this page you will be able to view all of our Accounts and the Directories Assigned to them! This page is designed to be very responsive to user input.</p>
            <p>Information that you will get:</p>
            <ul>
              <li>Account Number (Client Number)</li>
              <li>Client Name (Client)</li>
              <li>Directory Name (Directory)</li>
            </ul>
            <p>Filter Options are:</p>
            <ul>
              <li>Page Number: Use this option to quickly jump to a specific page.</li>
              <li>Account Number: Enter the Account Number for the account that you are looking for. Page updates as you type in your filter.</li>
              <li>Account Name: Enter the Account Name for the account that you are looking for. Page updates as you type in your filter.</li>
              <li>Directory Name: Enter the Directory Name for the directory that you are looking for. Page updates as you type in your filter.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header style={headerStyle}>Get Contacts And Directories</Accordion.Header>
          <Accordion.Body style={bodyStyle}>
            <h1>DOWN FOR MAINTENACE!</h1>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header style={headerStyle}>Get Databased Providers</Accordion.Header>
          <Accordion.Body style={bodyStyle}>
            <p>On this page you will be able to view all of our on file provider information! This page is designed to be very responsive to user input.</p>
            <p>The information that you will get is dependent on what we have in the database and will display with the database column names.</p>
            <p>Different drop down list options and the Database Table they belong to</p>
            <ul>
              <li>Unlisted: 0_AnSer_Doctor_Database</li>
              <li>Agnesian: Agnesian_Doctors</li>
              <li>Aspirus At Home Central Time: 88403_AspAtHome</li>
              <li>Aspirus At Home Eastern Time: 88405_AspAtHomeMI</li>
              <li>Aurora: Aurora_Doctors</li>
              <li>Beloit: 9715_Beloit_Health</li>
              <li>Corvallis: Corvallis</li>
              <li>ForeFront Dermatology: 1278_Dermatology_Associates</li>
              <li>Nova Health: NovaHealthProviders</li>
              <li>Peace Health: Peace_Health_Providers</li>
              <li>Rome Medical: RomeMedical</li>
            </ul>
            <p>Filter Options are:</p>
            <ul>
              <li>Page Number: Use this option to quickly jump to a specific page.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="5">
          <Accordion.Header style={headerStyle}>Get DID</Accordion.Header>
          <Accordion.Body style={bodyStyle}>
            <p>On this page you will be able to view all of our Accounts and the DID Assigned to them! This page is designed to be very responsive to user input.</p>
            <p>The Toggle Active DID will switch between DID's that are in use and DID's that are not in use but it is documented that we own that phone number.</p>
            <p><strong style={{color: '#FF3333'}}>NOTE:</strong> If an Account Number appears multiple times then there are multiple DID's for that account.</p>
            <p>Information that you will get (If the Toggle Active DID is checked):</p>
            <ul>
              <li>Account Number (Client Number)</li>
              <li>Client Name</li>
              <li>DID Number</li>
              <li>Phone Provider (Provider)
                <ul>
                  <li>Amtelco</li>
                  <li>Nsight</li>
                  <li>Pulsar</li>
                  <li>ThinQ</li>
                  <li>Unknown</li>
                </ul>
              </li>
            </ul>
            <p>Filter Options are:</p>
            <ul>
              <li>Page Number: Use this option to quickly jump to a specific page.</li>
              <li>Account Number: Enter the Account Number for the account that you are looking for. Page updates as you type in your filter.</li>
              <li>Account Name: Enter the Account Name for the account that you are looking for. Page updates as you type in your filter.</li>
              <li>DID Number: Enter the DID Number, only numbers no dashes (-), for the Call Fowarding Number that you are looking for. Page updates as you type in your filter.</li>
            </ul>
            <p>Information that you will get (If the Toggle Active DID is NOT checked):</p>
            <ul>
              <li>DID Number</li>
              <li>Phone Provider (Provider)
                <ul>
                  <li>Amtelco</li>
                  <li>Nsight</li>
                  <li>Pulsar</li>
                  <li>ThinQ</li>
                  <li>Unknown</li>
                </ul>
              </li>
            </ul>
            <p>Filter Options are:</p>
            <ul>
              <li>Page Number: Use this option to quickly jump to a specific page.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="6">
          <Accordion.Header style={headerStyle}>Get Directory Contacts And Info Cards</Accordion.Header>
          <Accordion.Body style={bodyStyle}>
            <p>This page functions based off of the Choose An Account Number Auto-Fill drop down list!</p>
            <p>This page can only find IS directories that are attached to an account in IS. Infinity Directories will need to be obtained VIA a different method.</p>
            <p>
              When you select an account that has an IS directory attached to it you will then be able to select the "Click Here to Download" button.
              This button will begin downloading all directory information and put it into a CSV file to be shared with the client or backed up.
            </p>
            <p>
              Do a search in the spreadsheet for 0 or Undefined. 
              These are default values that get passed. The server should auto-remove undefined data but sometimes it sneaks its way through.
            </p>
            <p>
              If the CSV file is blank but the web page shows that there should have been data please submit a support ticket to Stephen Merki in freshdesk and label the type as API.
              Information that I will need:
              <ul>
                <li>Account Number</li>
                <li>API Server URL (there are two servers | Production and Developer)</li>
                <li>Date and Time of when you attempted to download the CSV</li>
                <li>The CSV document even if it is blank</li>
              </ul>
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="7">
          <Accordion.Header style={headerStyle}>Get Info Pages</Accordion.Header>
          <Accordion.Body style={bodyStyle}>
            <p>This page functions based off of the Choose An Account Number Auto-Fill drop down list!</p>
            <p>This page will only bring in the IS info pages. If you need Infinity info pages you will need to get the from somewhere else</p>
            <p>
              When you select an account you will then be able to select the "Click Here to Download" button.
              This button will download all of the info pages for the selected account and put a page break between each page.
              With how the Word Documents are being generated it is currently not possible to add anything to the header or footer of the word document.
            </p>
            <p>
              There are still some images that will appear as a box with a red <span style={{color: '#FF3333'}}>X</span> in it. 
              You should be able to delete it but these are typically the dial string images that appear in the info pages next to the phone number to dial.
              Most of these images have been purged before the download but for some reason there are several ways that Amtelco declared an image tag. 
              Which has made it very hard to catch them all.
            </p>
            <p>
              Reasons to submit a support ticket to Stephen Merki in freshdesk with the label type as API:
              <ul>
                <li>The Word document is blank</li>
                <li>The Web Page is blank</li>
                <li>Missing information/data that should be there</li>
                <li>The document has a System Shared Field ID instead of the value/data from the System Shared Field</li>
                <li>The document has a Client Shared Field ID instead of the value/data from the Client Shared Field</li>
                <li>Unlisted</li>
              </ul>
              Information that I will need:
              <ul>
                <li>Account Number</li>
                <li>API Server URL (there are two servers | Production and Developer)</li>
                <li>Date and Time of when you attempted to download the Word Document</li>
                <li>The Word document even if it is blank</li>
              </ul>
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default DocumentationPage;