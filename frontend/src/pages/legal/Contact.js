import React from 'react';
import { Container, Typography, Paper, Box, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';

function Contact() {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Us
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Get in Touch
          </Typography>
          <Typography paragraph>
            We value your feedback and are here to help with any questions or suggestions you may have
            about Tech Tools.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Contact Methods
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmailIcon sx={{ mr: 2 }} />
            <Link href="mailto:tech.tools.feedback@gmail.com" underline="hover">
              tech.tools.feedback@gmail.com
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GitHubIcon sx={{ mr: 2 }} />
            <Link href="https://github.com/TechTools-web/feedback" target="_blank" rel="noopener noreferrer" underline="hover">
              GitHub Repository
            </Link>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Bug Reports & Feature Requests
          </Typography>
          <Typography paragraph>
            Found a bug or have a feature suggestion? Please visit our GitHub repository to submit an
            issue or contribute to the project.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Contact;
