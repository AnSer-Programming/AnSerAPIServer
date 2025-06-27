// src/pages/ClientInfo/OfficeReach.jsx
import React from 'react';
import { Typography } from '@mui/material';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import ClientInfoNavbar from './ClientInfoNavbar';
import './ClientInfoReact.css';

const OfficeReach = () => {
  const { darkMode } = useClientInfoTheme();

  return (
    <div className={`client-info-react-container ${darkMode ? 'dark' : 'light'}`}>
      <ClientInfoNavbar />

      {/* Main Content */}
      <div className="container mt-4">
        <div className="breadcrumbNav">
          <h4 id="breadcrumb">Office Reach</h4>
        </div>

        <div className="pageTitle mb-4">
          <h2>Office Reach Information</h2>
          <p>
            The questions below help define where and how a message gets delivered depending on the day and time.
            This is useful when determining availability and routing needs.
          </p>
        </div>

        <div className="container mb-5">
          <div className="accordion" id="officeReachAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  What are your regular office hours?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#officeReachAccordion"
              >
                <div className="accordion-body">
                  Include standard hours the office is open each day.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Are there times when calls should go directly to voicemail or skip alerting staff?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#officeReachAccordion"
              >
                <div className="accordion-body">
                  Identify after-hours policies or holidays where staff should not be contacted.
                </div>
              </div>
            </div>

            {/* Additional sections can go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeReach;
