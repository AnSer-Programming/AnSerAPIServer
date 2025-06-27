import React, { useState } from 'react';

function ClientInfoComponent() {
  const [selectedForm, setSelectedForm] = useState('startNewClient');

  const renderForm = () => {
    const formPaths = {
      answerCalls: '/ClientInfo/answerCalls.html',
      clientSetUp: '/ClientInfo/clientSetUp.html',
      officeReach: '/ClientInfo/officeReach.html',
      startNewClient: '/ClientInfo/startNewClient.html',
      test: '/ClientInfo/test.html'
    };

    const src = formPaths[selectedForm];

    return src ? (
      <iframe
        src={src}
        title={selectedForm}
        width="100%"
        height="600px"
        style={{ border: 'none' }}
      />
    ) : (
      <h3>Form not found</h3>
    );
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Client Information Management</h1>

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

      <div className="text-center mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => window.location.href = '/ClientInfo/clientSetUp.html'}
        >
          Go to Client Setup
        </button>
      </div>
    </div>
  );
}

export default ClientInfoComponent;
