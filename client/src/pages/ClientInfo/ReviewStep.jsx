import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useWizard } from './WizardContext';
import { submitClientWizardData } from './ClientWizardAPI';
import { toCSV, toPDF, toMSWord } from '../../components/Utility/DownloadHelper';

const ReviewStep = () => {
  const { formData } = useWizard();
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const flattenObject = (obj, prefix = '', res = {}) => {
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenObject(value, newKey, res);
      } else {
        res[newKey] = Array.isArray(value) ? value.join(', ') : value;
      }
    }
    return res;
  };

  const downloadCSV = () => {
    const flatData = flattenObject(formData);
    const rows = Object.entries(flatData).map(([key, value]) => `${key},${value}`);
    const csvContent = rows.join('\n\r');
    toCSV(csvContent, 'client-intake');
  };

  const downloadWord = () => {
    const flatData = flattenObject(formData);
    const htmlContent = Object.entries(flatData)
      .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
      .join('');
    toMSWord(htmlContent, 'client-intake');
  };

  const handleSubmit = async () => {
    setStatus('submitting');
    try {
      const response = await submitClientWizardData(formData);
      if (response.ok) {
        setStatus('success');
        localStorage.removeItem('wizardFormData');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('wizardFormData');
    window.location.href = '/ClientInfoReact/NewFormWizard';
  };

  return (
    <Box className="card p-4">
      <Typography variant="h5" gutterBottom>
        Review & Submit
      </Typography>
      <Typography variant="body2" className="mb-3">
        Below is a preview of your submission. You can also download it.
      </Typography>

      <pre
        style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '6px',
          fontSize: '0.85rem',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        {JSON.stringify(formData, null, 2)}
      </pre>

      <Box className="d-flex flex-wrap gap-2 mt-3 mb-4">
        <Button variant="outlined" onClick={downloadCSV}>
          Export to CSV
        </Button>
        <Button variant="outlined" onClick={downloadWord}>
          Export to Word
        </Button>
      </Box>

      {status === 'success' && <Alert severity="success">Submission successful! 🎉</Alert>}
      {status === 'error' && <Alert severity="error">Something went wrong. Please try again.</Alert>}

      <Box className="d-flex flex-wrap gap-2 mt-3">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          Submit to API
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset & Start Over
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewStep;
