import React, { useState } from 'react';

// Define the interface for the props
interface GetResidentDirectoryProps {
  accountData: Resident[];
  onEdit: (updatedData: Resident[]) => void; 
  textStyle: React.CSSProperties;
}

// Define the interface for a resident
interface Resident {
  resident_full_name: string;
  resident_room_number: string;
  resident_phone_number: string;
}

const GetResidentDirectory: React.FC<GetResidentDirectoryProps> = ({ accountData, onEdit, textStyle }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedResident, setEditedResident] = useState<Resident | null>(null);

  const filteredData = accountData.filter((resident) =>
    resident.resident_full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditedResident({ ...accountData[index] });
  };

  const handleInputChange = (field: keyof Resident, value: string) => {
    if (editedResident) {
      setEditedResident({ ...editedResident, [field]: value });
    }
  };

  const handleSaveClick = () => {
    if (editIndex !== null && editedResident) {
      const updatedData = [...accountData];
      updatedData[editIndex] = editedResident;
      onEdit(updatedData);
    }
    cancelEdit();
  };

  const handleDeleteClick = () => {
    if (editIndex !== null) {
      const updatedData = accountData.filter((_, index) => index !== editIndex);
      onEdit(updatedData);
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditedResident(null);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInputStyle}
      />

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}></th>
            <th style={tableHeaderStyle}>Resident Name</th>
            <th style={tableHeaderStyle}>Room No.</th>
            <th style={tableHeaderStyle}>Phone No.</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((resident, index) => (
              <tr key={index} style={tableRowStyle}>
                <td style={buttonCellStyle}>
                  {editIndex === index ? (
                    <>
                      <button style={saveButtonStyle} onClick={handleSaveClick}>Save</button>
                      <button style={deleteButtonStyle} onClick={handleDeleteClick}>Delete</button>
                      <button style={cancelButtonStyle} onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <button style={editButtonStyle} onClick={() => handleEditClick(index)}>Edit</button>
                  )}
                </td>
                <td style={compactTextStyle}>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editedResident?.resident_full_name || ''}
                      onChange={(e) => handleInputChange('resident_full_name', e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    <span style={textStyle}>{resident.resident_full_name}</span>
                  )}
                </td>
                <td style={compactTextStyle}>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editedResident?.resident_room_number || ''}
                      onChange={(e) => handleInputChange('resident_room_number', e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    <span style={textStyle}>{resident.resident_room_number}</span>
                  )}
                </td>
                <td style={compactTextStyle}>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editedResident?.resident_phone_number || ''}
                      onChange={(e) => handleInputChange('resident_phone_number', e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    <span style={textStyle}>{resident.resident_phone_number}</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>No residents found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Style for the table
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

// Style for the table header
const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: '#003366',
  color: '#fff',
  padding: '5px',
  border: '1px solid #ccc',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

// Style for compact button cell with matching header color
const buttonCellStyle: React.CSSProperties = {
  backgroundColor: '#003366',
  color: '#fff',
  textAlign: 'center',
  padding: '2px 5px',
  whiteSpace: 'nowrap',
};

// Style for compact text cells
const compactTextStyle: React.CSSProperties = {
  padding: '2px 5px',
  border: '1px solid #ccc',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
};

// Style for table rows
const tableRowStyle: React.CSSProperties = {
  padding: '2px',
  borderBottom: '1px solid #ccc',
};

// Style for input fields in edit mode
const inputStyle: React.CSSProperties = {
  padding: '2px 4px',
  margin: 0,
  width: '90%',
  boxSizing: 'border-box',
  fontSize: '14px',
};

// Style for the search input
const searchInputStyle: React.CSSProperties = {
  marginBottom: '10px',
  padding: '5px',
  width: '100%',
};

// Style for the Edit button
const editButtonStyle: React.CSSProperties = {
  padding: '2px 5px',
  backgroundColor: '#003366',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

// Style for the Save button
const saveButtonStyle: React.CSSProperties = {
  ...editButtonStyle,
  backgroundColor: '#28a745',
};

// Style for the Delete button
const deleteButtonStyle: React.CSSProperties = {
  ...editButtonStyle,
  backgroundColor: '#dc3545',
};

// Style for the Cancel button
const cancelButtonStyle: React.CSSProperties = {
  ...editButtonStyle,
  backgroundColor: '#ffc107',
};

export default GetResidentDirectory;






























