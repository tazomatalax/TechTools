import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import AboutToolSection from '../../components/AboutToolSection';

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ global: true, ignoreCase: false, multiline: false });
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (!pattern) {
        setMatches([]);
        setError('');
        return;
      }

      let flagString = '';
      if (flags.global) flagString += 'g';
      if (flags.ignoreCase) flagString += 'i';
      if (flags.multiline) flagString += 'm';

      const regex = new RegExp(pattern, flagString);
      const results = [];
      let match;

      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setMatches(results);
      setError('');
    } catch (err) {
      setError(err.message);
      setMatches([]);
    }
  }, [pattern, testString, flags]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Regex Tester
        </Typography>
        <Paper sx={{ p: 3, my: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Regular Expression"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={flags.global}
                      onChange={(e) => setFlags({ ...flags, global: e.target.checked })}
                    />
                  }
                  label="Global (g)"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={flags.ignoreCase}
                      onChange={(e) => setFlags({ ...flags, ignoreCase: e.target.checked })}
                    />
                  }
                  label="Ignore Case (i)"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={flags.multiline}
                      onChange={(e) => setFlags({ ...flags, multiline: e.target.checked })}
                    />
                  }
                  label="Multiline (m)"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Test String"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Matches ({matches.length})
              </Typography>
              {matches.map((match, index) => (
                <Paper key={index} sx={{ p: 2, my: 1, bgcolor: 'background.default', border: 1, borderColor: 'divider' }}>
                  <Typography color="text.primary">
                    Match {index + 1}: "{match.match}" at index {match.index}
                  </Typography>
                  {match.groups.length > 0 && (
                    <Typography color="text.primary">
                      Groups: {match.groups.map((g, i) => `${i + 1}: "${g}"`).join(', ')}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Grid>
          </Grid>
        </Paper>

        <AboutToolSection
          title="Regular Expression Tester"
          description="The Regular Expression Tester is a comprehensive tool for creating, testing, and debugging 
            regular expressions. It provides real-time matching and validation, making it easier to develop and 
            verify regex patterns for various text processing tasks."
          features={[
            {
              title: 'Pattern Testing',
              items: [
                'Real-time pattern matching',
                'Match highlighting',
                'Group capture display',
                'Match index positions'
              ]
            },
            {
              title: 'Regex Options',
              items: [
                'Global matching (g flag)',
                'Case-insensitive matching (i flag)',
                'Multiline mode (m flag)',
                'Error detection and reporting'
              ]
            },
            {
              title: 'Visual Feedback',
              description: 'Immediate visual feedback for pattern matches and errors'
            },
            {
              title: 'Match Information',
              description: 'Detailed information about each match including captured groups'
            }
          ]}
          useCases={[
            'Text Processing: Develop and test patterns for text extraction',
            'Data Validation: Create patterns for input validation',
            'Search and Replace: Test patterns for text transformation',
            'Data Parsing: Verify patterns for parsing structured text'
          ]}
        />
      </Box>
    </Container>
  );
};

export default RegexTester;
