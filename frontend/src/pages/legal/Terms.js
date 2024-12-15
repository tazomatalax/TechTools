import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

function Terms() {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Service
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By accessing and using Tech Tools, you accept and agree to be bound by the terms and provisions 
            of this agreement. If you do not agree to these terms, please do not use our services.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Use License
          </Typography>
          <Typography paragraph>
            Tech Tools grants you a personal, non-exclusive, non-transferable license to use our tools 
            for personal or professional purposes. All calculations and results are provided "as is" 
            without any warranty of accuracy.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Disclaimer
          </Typography>
          <Typography paragraph>
            The tools and calculations provided are for reference purposes only. Users should independently 
            verify all results. We are not responsible for any damages or losses resulting from the use 
            of our tools.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Modifications
          </Typography>
          <Typography paragraph>
            We reserve the right to modify or discontinue any aspect of Tech Tools at any time. Changes 
            to these terms will be effective immediately upon posting on this page.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: December 2024
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Terms;
