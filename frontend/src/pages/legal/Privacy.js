import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

function Privacy() {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Data Collection
          </Typography>
          <Typography paragraph>
            Tech Tools is designed with privacy in mind. We do not collect any personal information or track 
            user behavior. All calculations and conversions are performed locally in your browser.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Local Storage
          </Typography>
          <Typography paragraph>
            Some tools may use local storage to save your preferences or recent calculations. This data 
            remains on your device and is never transmitted to our servers.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Third-Party Services
          </Typography>
          <Typography paragraph>
            Tech Tools does not integrate with any third-party analytics or tracking services. We believe 
            in providing a clean, privacy-respecting experience for our users.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Updates to Privacy Policy
          </Typography>
          <Typography paragraph>
            This privacy policy may be updated occasionally. Any changes will be reflected on this page 
            with an updated revision date.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: December 2024
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Privacy;
