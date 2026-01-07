import React from 'react';
import { Box, Button, Typography } from '@mui/material';

class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    // You could log to analytics here
    // console.error('ChunkErrorBoundary caught', error);
  }

  handleReload = () => {
    // Clear runtime caches for webpack's HMR chunk mapping then reload
    // A full reload is the most reliable recovery from missing/stale chunks
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;

    if (!hasError) return this.props.children || null;

    const isChunkError = error && /Loading chunk|ChunkLoadError/.test(error.message || '');

    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Something failed to load</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {isChunkError ? (
            'A piece of the application failed to download — this often happens when code changes while the dev server is running. Reloading the page usually fixes it.'
          ) : (
            'An unexpected error occurred. You can try reloading the page.'
          )}
        </Typography>
        <Button variant="contained" color="primary" onClick={this.handleReload} sx={{ mr: 1 }}>
          Reload
        </Button>
        <Button variant="outlined" onClick={() => this.setState({ hasError: false, error: null })}>
          Dismiss
        </Button>
      </Box>
    );
  }
}

export default ChunkErrorBoundary;
