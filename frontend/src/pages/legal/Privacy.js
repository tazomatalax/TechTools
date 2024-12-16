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
            Tech Tools is designed with privacy in mind. While we do not directly collect personal information, 
            we use Google AdSense on our website. Google AdSense may use cookies and other tracking technologies 
            to collect data about your browsing behavior and interests to show you personalized ads.
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
            Tech Tools integrates Google AdSense to display advertisements. Google AdSense uses cookies 
            and similar technologies to collect and process data about you. To learn more about how Google 
            uses your data, please visit Google's Privacy & Terms site at https://policies.google.com/technologies/partner-sites.
            You can opt out of personalized advertising by visiting Google's Ad Settings.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
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
