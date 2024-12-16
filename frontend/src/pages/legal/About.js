import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

function About() {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Tech Tools
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Our Mission
          </Typography>
          <Typography paragraph>
            Tech Tools is a comprehensive suite of utilities designed to assist engineers, developers, and tech enthusiasts 
            in their electronic and software project development. Our mission is to provide high-quality, easy-to-use tools that streamline technical calculations 
            and conversions. We often found in our own projects that the tools we needed were either not available or spread accross multiple platforms or websites.
            We sought to create a one-stop place for all of the tools we use in our own projects, and we hope you find them useful as well! As needs arise we will continue to expand our collection of tools,
            and we invite you to join our community of users and developers by suggesting new tools and features that you would find useful.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            What We Offer
          </Typography>
          <Typography paragraph>
            Our platform provides tools across four main categories:
          </Typography>
          <ul>
            <Typography component="li">Electronic Design: For circuit design and component calculations</Typography>
            <Typography component="li">Signal & Power: Tools for signal processing and power analysis</Typography>
            <Typography component="li">Data & Communication: Utilities for data transfer and communication protocols</Typography>
            <Typography component="li">Developer Tools: Software development and data manipulation utilities</Typography>
          </ul>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Open Source
          </Typography>
          <Typography paragraph>
            Tech Tools is committed to the open-source community. We believe in transparency and collaborative 
            development. Our tools are continuously improved based on user feedback and community contributions.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default About;
