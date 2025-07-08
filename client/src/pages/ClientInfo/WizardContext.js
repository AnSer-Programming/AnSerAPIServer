// src/pages/ClientInfo/WizardContext.js

import React, { createContext, useContext, useState } from 'react';

const WizardContext = createContext(null);

export const WizardProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const stored = localStorage.getItem('wizardFormData');
    return stored
      ? JSON.parse(stored)
      : {
          clientSetUp: {},
          officeReach: {},
          answerPrefs: {}
        };
  });

  const updateSection = (section, data) => {
    const updated = { ...formData, [section]: data };
    setFormData(updated);
    localStorage.setItem('wizardFormData', JSON.stringify(updated));
  };

  return (
    <WizardContext.Provider value={{ formData, updateSection }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used inside WizardProvider');
  }
  return context;
};
