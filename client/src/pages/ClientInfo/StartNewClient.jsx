// src/pages/ClientInfo/StartNewClient.jsx
import React from "react";
import { Link } from "react-router-dom";
import AnSerLogo from "../../assets/img/ClientInfo/AnSerLogo.png";
import { useClientInfoTheme } from "./ClientInfoThemeContext";
import ClientInfoNavbar from "./ClientInfoNavbar";
import ClientInfoFooter from "./ClientInfoFooter";
import "./ClientInfoReact.css";

const StartNewClient = () => {
  const { darkMode } = useClientInfoTheme();

  return (
    <div
      className={`client-info-react-container d-flex flex-column min-vh-100 ${
        darkMode ? "dark" : "light"
      }`}
    >
      <ClientInfoNavbar />

      <div className="container text-center mt-4 flex-grow-1">
        {/* Logo */}
        <div className="imageHolder mb-4">
          <img
            src={AnSerLogo}
            alt="AnSer Logo"
            style={{ maxWidth: "280px", width: "100%", height: "auto" }}
          />
        </div>

        {/* Breadcrumb */}
        <div className="breadcrumbNav mb-3">
          <h4 id="breadcrumb">Start New Client</h4>
        </div>

        {/* Title */}
        <div className="pageTitle mb-4">
          <h2 className="fw-bold">Welcome to AnSer</h2>
          <h5 className="text-secondary">
            To get started, please choose a category below:
          </h5>
        </div>

        {/* Navigation Buttons */}
        <div className="d-flex flex-column align-items-center gap-3 mb-5">
          <Link
            to="/ClientInfoReact/NewFormWizard/ClientSetUp"
            className="btn btn-primary w-100"
            style={{ maxWidth: "400px" }}
          >
            Company Information
          </Link>
          <Link
            to="/ClientInfoReact/NewFormWizard/OfficeReach"
            className="btn btn-primary w-100"
            style={{ maxWidth: "400px" }}
          >
            Office Reach Information
          </Link>
          <Link
            to="/ClientInfoReact/NewFormWizard/AnswerCalls"
            className="btn btn-primary w-100"
            style={{ maxWidth: "400px" }}
          >
            How to Answer Your Calls
          </Link>
          <Link
            to="/ClientInfoReact/NewFormWizard/Review"
            className="btn btn-success w-100"
            style={{ maxWidth: "400px" }}
          >
            Review & Submit
          </Link>
          <Link
            to="/ClientInfoReact/TestPage"
            className="btn btn-warning w-100"
            style={{ maxWidth: "400px" }}
          >
            Test Page
          </Link>
          <Link
            to="/ClientInfoReact/ATools"
            className="btn btn-dark w-100"
            style={{ maxWidth: "400px" }}
          >
            Admin Tools
          </Link>
        </div>
      </div>

      <ClientInfoFooter />
    </div>
  );
};

export default StartNewClient;
