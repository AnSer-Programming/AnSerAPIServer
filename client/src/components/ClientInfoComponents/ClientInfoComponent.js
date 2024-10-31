import React, { useState } from 'react';

function ClientInfoComponent() {
  const [selectedForm, setSelectedForm] = useState('startNewClient');

  // Function to render the selected HTML form in an iframe
  const renderForm = () => {
    let src;
    switch (selectedForm) {
      case 'answerCalls':
        src = '/ClientInfo/answerCalls.html';
        break;
      case 'clientSetUp':
        src = '/ClientInfo/clientSetUp.html';
        break;
      case 'officeReach':
        src = '/ClientInfo/officeReach.html';
        break;
      case 'startNewClient':
        src = '/ClientInfo/startNewClient.html';
        break;
      case 'test':
        src = '/ClientInfo/test.html';
        break;
      default:
        return <h3>Form not found</h3>;
    }

    return (
      <iframe 
        src={src}
        title={selectedForm}
        width="100%"
        height="600px"
        style={{ border: 'none' }}
      />
    );
  };

  return (
    <div className="container mt-3">
      <h1>Client Information Management</h1>
      <div className="btn-group mb-3" role="group">
        <button className="btn btn-primary" onClick={() => setSelectedForm('startNewClient')}>
          Start New Client
        </button>
        <button className="btn btn-primary" onClick={() => setSelectedForm('clientSetUp')}>
          Company Information
        </button>
        <button className="btn btn-primary" onClick={() => setSelectedForm('officeReach')}>
          Office Reach Info
        </button>
        <button className="btn btn-primary" onClick={() => setSelectedForm('answerCalls')}>
          How to Answer Calls
        </button>
        <button className="btn btn-primary" onClick={() => setSelectedForm('test')}>
          Test Form
        </button>
      </div>
      {renderForm()}
    </div>
  );
}

export default ClientInfoComponent;



