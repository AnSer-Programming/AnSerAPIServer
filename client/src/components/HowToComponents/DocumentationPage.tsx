import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';

const DocumentationPage = () => {
  const content = [{ Title: "Display Field", Body: "A display field is a text blob in the script to inform the agent of either something that will occur in the script or information on what is happening with the office." }]
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

  function accordionBuilder() {
    let accordionItems = new Array();
    let index:string;

    for (let i = 0; i < content.length; i++) {
      index = `${i}`
      accordionItems.push(
        <Accordion.Item eventKey={index} >
          <Accordion.Header style={headerStyle}>{content[i].Title}</Accordion.Header>
          <Accordion.Body style={bodyStyle}>
            <p>
              {content[i].Body}
            </p>
          </Accordion.Body>
        </Accordion.Item >
      )
    }

    return accordionItems;
  }

return (
  <>
    <h2>Click on the option that you want more information on.</h2>
    <p>
      This page is set up to help uniform the terminology that we all use through out the IS system.
    </p>
    <Accordion style={accordionStyle}>
      {accordionBuilder()}
    </Accordion>
  </>
);
};

export default DocumentationPage;