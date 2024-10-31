import React, { useState } from 'react';

// Define the interface for the props
interface SetResidentDirectoryProps {
  accountData: Resident[]; // Adjust 'Resident[]' to the specific data type if needed
  setEdit: (isEdit: boolean) => void; 
}

// Define the interface for a resident
interface Resident {
  resident_full_name: string;
  resident_room_number: string;
  resident_phone_number: string;
}

const SetResidentDirectory: React.FC<SetResidentDirectoryProps> = ({ accountData, setEdit }) => {
  const [residentData, setResidentData] = useState<Resident[]>(accountData);

  const handleInputChange = (index: number, field: keyof Resident, value: string) => {
    const updatedData = [...residentData];
    updatedData[index][field] = value;
    setResidentData(updatedData);
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#f4f4f4', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 20, color: '#000' }}>Edit Resident Directory</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Resident Name</th>
            <th style={tableHeaderStyle}>Room Number</th>
            <th style={tableHeaderStyle}>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {residentData.map((resident, index) => (
            <tr key={index} style={tableRowStyle}>
              <td>
                <input
                  type="text"
                  value={resident.resident_full_name}
                  onChange={(e) => handleInputChange(index, 'resident_full_name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={resident.resident_room_number}
                  onChange={(e) => handleInputChange(index, 'resident_room_number', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={resident.resident_phone_number}
                  onChange={(e) => handleInputChange(index, 'resident_phone_number', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Style for the table header
const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: '#003366',
  color: '#fff',
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left',
};

// Style for table rows
const tableRowStyle: React.CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #ccc',
};

export default SetResidentDirectory;




