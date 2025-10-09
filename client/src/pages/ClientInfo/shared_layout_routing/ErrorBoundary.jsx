import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // TODO: Log to external service or console
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', info?.componentStack);
  }

  handleReload = () => {
    window.location.assign('/');
  };

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (!hasError) return children;

    return (
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default', color: 'text.primary' }}>
        <Typography variant="h5" gutterBottom>Something went wrong.</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          We apologize for the inconvenience. Please return to the dashboard.
        </Typography>
        <Button variant="contained" color="primary" onClick={this.handleReload}>
          Return to Dashboard
        </Button>
      </Box>
    );
  }
}

export default ErrorBoundary;
