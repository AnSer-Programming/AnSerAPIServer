// src/pages/ClientInfo/ClientWizardAPI.js

export const submitClientWizardData = async (data) => {
  try {
    const response = await fetch('/api/ClientWizard/Submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Submission failed:', response.status, errorText);
    }

    return response;
  } catch (err) {
    console.error('Network error while submitting client wizard data:', err);
    throw err;
  }
};

export const sendSummaryEmail = async (payload) => {
  try {
    const response = await fetch('/api/ClientWizard/EmailSummary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Summary email failed:', response.status, errorText);
    }

    return response;
  } catch (err) {
    console.error('Network error while sending summary email:', err);
    throw err;
  }
};
