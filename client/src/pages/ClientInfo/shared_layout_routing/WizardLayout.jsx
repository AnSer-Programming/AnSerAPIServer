import React from 'react';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
import ChunkErrorBoundary from '../components/ChunkErrorBoundary';

const WizardLayout = ({ children }) => {
  return (
    <div>
      <ClientInfoNavbar />
      <main>
        <ChunkErrorBoundary>
          {children}
        </ChunkErrorBoundary>
      </main>
      <ClientInfoFooter />
    </div>
  );
};

export default WizardLayout;
