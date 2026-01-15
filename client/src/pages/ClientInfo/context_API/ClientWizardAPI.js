// src/pages/ClientInfo/ClientWizardAPI.js

import logger from '../utils/logger';

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
      logger.error('Submission failed:', response.status, errorText);
    }

    return response;
  } catch (err) {
    logger.error('Network error while submitting client wizard data:', err);
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
      logger.error('Summary email failed:', response.status, errorText);
    }

    return response;
  } catch (err) {
    logger.error('Network error while sending summary email:', err);
    throw err;
  }
};
