import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AboutToolSection from '../../components/AboutToolSection';

const StyledPre = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  overflow: 'auto',
  '&.error': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },
}));

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [options, setOptions] = useState({
    indent: 2,
    sortKeys: false,
    compactMode: false,
  });

  const formatJson = () => {
    try {
      let parsed = JSON.parse(input);
      
      if (options.sortKeys) {
        parsed = sortObjectKeys(parsed);
      }

      const formatted = JSON.stringify(
        parsed,
        null,
        options.compactMode ? 0 : options.indent
      );

      setOutput(formatted);
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const sortObjectKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
          result[key] = sortObjectKeys(obj[key]);
          return result;
        }, {});
    }
    return obj;
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          JSON Formatter & Validator
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Input JSON"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              error={!!error}
              helperText={error}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant="contained" onClick={formatJson}>
                Format JSON
              </Button>
              <Button variant="outlined" onClick={handleMinify}>
                Minify
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.sortKeys}
                    onChange={(e) =>
                      setOptions({ ...options, sortKeys: e.target.checked })
                    }
                  />
                }
                label="Sort Keys"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={options.compactMode}
                    onChange={(e) =>
                      setOptions({ ...options, compactMode: e.target.checked })
                    }
                  />
                }
                label="Compact Mode"
              />
            </Box>
          </Grid>
          {output && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Formatted Output
              </Typography>
              <StyledPre>{output}</StyledPre>
            </Grid>
          )}
        </Grid>
      </Box>
      <AboutToolSection
        title="JSON Formatter"
        description="The JSON Formatter is a powerful tool for formatting, validating, and organizing JSON data. 
          It helps developers work with JSON by providing various formatting options and validation features, 
          making it easier to read, debug, and maintain JSON data structures."
        features={[
          {
            title: 'Formatting Options',
            items: [
              'Customizable indentation',
              'Key sorting for better organization',
              'Compact mode for minification',
              'Syntax error detection'
            ]
          },
          {
            title: 'Validation Features',
            items: [
              'Real-time JSON syntax validation',
              'Detailed error reporting',
              'Structure verification'
            ]
          },
          {
            title: 'Data Organization',
            description: 'Sort object keys alphabetically for consistent formatting'
          },
          {
            title: 'Output Options',
            description: 'Switch between pretty-printed and minified output'
          }
        ]}
        useCases={[
          'API Development: Format and validate JSON request/response bodies',
          'Configuration Files: Clean up and organize JSON configuration files',
          'Data Analysis: Format JSON data exports for better readability',
          'Documentation: Create well-formatted JSON examples'
        ]}
      />
    </Container>
  );
};

export default JsonFormatter;
