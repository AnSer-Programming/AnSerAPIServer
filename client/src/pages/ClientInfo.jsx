import React, { useState, useEffect } from 'react';

function ClientInfo() {
  const [clientData, setClientData] = useState([]);
  const [accountNum, setAccountNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch client info from the API
  const fetchClientInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/clientInfo/${accountNum}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setClientData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => setAccountNum(e.target.value);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountNum) {
      fetchClientInfo();
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Client Information</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <input
            type="text"
            value={accountNum}
            onChange={handleChange}
            placeholder="Enter Account Number"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {clientData.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Name</th>
              <th>Contact Email</th>
              <th>Contact Phone</th>
            </tr>
          </thead>
          <tbody>
            {clientData.map((client) => (
              <tr key={client.id}>
                <td>{client.client_name}</td>
                <td>{client.contact_name}</td>
                <td>{client.contact_email}</td>
                <td>{client.contact_phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClientInfo;




