import React from 'react';
import './ClientInfoReact.css';

const ClientInfoFooter = () => {
  return (
    <footer className="bg-primary text-light py-3 mt-auto">
      <div className="container text-center small">
        <div>© {new Date().getFullYear()} AnSer Services | All rights reserved.</div>
        <div>Need help? <a href="mailto:support@anser.com" className="text-light text-decoration-underline">Contact Support</a></div>
        <div className="mt-1">Version 1.0.0 • Last updated: June 2025</div>
      </div>
    </footer>
  );
};

export default ClientInfoFooter;
