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
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import AboutToolSection from '../../components/AboutToolSection';

const StyledPre = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setSnackbarOpen(true);
    });
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          JSON Formatter & Validator
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
                <Tooltip title="Clear fields">
                  <IconButton 
                    onClick={handleClear}
                    sx={{ alignSelf: 'flex-start', ml: 1 }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Box>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6">
                    Formatted Output
                  </Typography>
                  <Tooltip title="Copy to clipboard">
                    <IconButton onClick={handleCopy} size="small">
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <StyledPre>{output}</StyledPre>
              </Grid>
            )}
          </Grid>
        </Paper>

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
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message="Copied to clipboard"
        />
      </Box>
    </Container>
  );
};

export default JsonFormatter;
