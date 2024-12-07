import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import AboutToolSection from '../../components/AboutToolSection';

// CRC lookup tables for common algorithms
const CRC_TABLES = {
  CRC8: Array(256).fill(0).map((_, i) => {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x80) ? ((crc << 1) ^ 0x07) : (crc << 1);
    }
    return crc & 0xFF;
  }),
  CRC16: Array(256).fill(0).map((_, i) => {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
    }
    return crc & 0xFFFF;
  }),
  CRC32: Array(256).fill(0).map((_, i) => {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? ((crc >>> 1) ^ 0xEDB88320) : (crc >>> 1);
    }
    return crc >>> 0;
  }),
};

const CrcCalculator = () => {
  const [values, setValues] = useState({
    input: '',
    algorithm: 'CRC32',
    inputFormat: 'text',
    initialValue: '0',
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    setError(null);
  };

  const handleAlgorithmChange = (event) => {
    setValues({
      ...values,
      algorithm: event.target.value,
    });
  };

  const handleInputFormatChange = (event, newFormat) => {
    if (newFormat !== null) {
      setValues({
        ...values,
        inputFormat: newFormat,
        input: '', // Clear input when changing format to prevent invalid data
      });
      setError(null);
    }
  };

  const validateInput = () => {
    if (!values.input.trim()) {
      setError('Input cannot be empty');
      return false;
    }

    if (values.inputFormat === 'hex') {
      const hexRegex = /^[0-9A-Fa-f\s]+$/;
      if (!hexRegex.test(values.input)) {
        setError('Invalid hexadecimal format');
        return false;
      }
    } else if (values.inputFormat === 'binary') {
      const binaryRegex = /^[01\s]+$/;
      if (!binaryRegex.test(values.input)) {
        setError('Invalid binary format');
        return false;
      }
    }

    return true;
  };

  const getBytes = () => {
    let bytes = [];
    if (values.inputFormat === 'text') {
      bytes = Array.from(new TextEncoder().encode(values.input));
    } else if (values.inputFormat === 'hex') {
      const hex = values.input.replace(/\s+/g, '');
      for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
      }
    } else if (values.inputFormat === 'binary') {
      const binary = values.input.replace(/\s+/g, '');
      for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.substr(i, 8).padEnd(8, '0');
        bytes.push(parseInt(byte, 2));
      }
    }
    return bytes;
  };

  const calculateCRC = () => {
    if (!validateInput()) return;

    try {
      const bytes = getBytes();
      let crc;

      switch (values.algorithm) {
        case 'CRC8':
          crc = parseInt(values.initialValue) & 0xFF;
          for (const byte of bytes) {
            crc = CRC_TABLES.CRC8[(crc ^ byte) & 0xFF];
          }
          break;

        case 'CRC16':
          crc = parseInt(values.initialValue) & 0xFFFF;
          for (const byte of bytes) {
            crc = (crc << 8) ^ CRC_TABLES.CRC16[((crc >> 8) ^ byte) & 0xFF];
          }
          break;

        case 'CRC32':
          crc = ~(parseInt(values.initialValue) >>> 0);
          for (const byte of bytes) {
            crc = (crc >>> 8) ^ CRC_TABLES.CRC32[(crc ^ byte) & 0xFF];
          }
          crc = ~crc >>> 0;
          break;

        default:
          throw new Error('Unsupported CRC algorithm');
      }

      setResults({
        hex: crc.toString(16).toUpperCase().padStart(values.algorithm === 'CRC8' ? 2 : values.algorithm === 'CRC16' ? 4 : 8, '0'),
        decimal: crc.toString(),
        binary: crc.toString(2).padStart(values.algorithm === 'CRC8' ? 8 : values.algorithm === 'CRC16' ? 16 : 32, '0'),
      });
      setError(null);
    } catch (err) {
      setError('Error calculating CRC: ' + err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          CRC Calculator
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Calculate CRC checksums using various algorithms and input formats
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <ToggleButtonGroup
                value={values.inputFormat}
                exclusive
                onChange={handleInputFormatChange}
                fullWidth
              >
                <ToggleButton value="text">Text</ToggleButton>
                <ToggleButton value="hex">Hexadecimal</ToggleButton>
                <ToggleButton value="binary">Binary</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Input Data"
              name="input"
              value={values.input}
              onChange={handleInputChange}
              error={!!error}
              helperText={error}
              placeholder={
                values.inputFormat === 'text' ? 'Enter text...' :
                values.inputFormat === 'hex' ? 'Enter hex values (e.g., 48 65 6C 6C 6F)' :
                'Enter binary values (e.g., 01001000 01100101)'
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>CRC Algorithm</InputLabel>
              <Select
                value={values.algorithm}
                label="CRC Algorithm"
                onChange={handleAlgorithmChange}
              >
                <MenuItem value="CRC8">CRC-8</MenuItem>
                <MenuItem value="CRC16">CRC-16 (CCITT)</MenuItem>
                <MenuItem value="CRC32">CRC-32</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Initial Value"
                name="initialValue"
                value={values.initialValue}
                onChange={handleInputChange}
                placeholder="0"
              />
              <Tooltip title="Starting value for CRC calculation (default: 0)">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateCRC}
            fullWidth
          >
            Calculate CRC
          </Button>
        </Box>

        {results && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Results:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      Hexadecimal:
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mx: 2 }}>
                      0x{results.hex}
                    </Typography>
                    <IconButton 
                      onClick={() => copyToClipboard(results.hex)}
                      size="small"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      Decimal:
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mx: 2 }}>
                      {results.decimal}
                    </Typography>
                    <IconButton
                      onClick={() => copyToClipboard(results.decimal)}
                      size="small"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      Binary:
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mx: 2, wordBreak: 'break-all' }}>
                      {results.binary}
                    </Typography>
                    <IconButton
                      onClick={() => copyToClipboard(results.binary)}
                      size="small"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Algorithm Details:
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  {values.algorithm === 'CRC8' && (
                    <Typography>
                      • CRC-8: x⁸ + x² + x + 1 (0x07)
                    </Typography>
                  )}
                  {values.algorithm === 'CRC16' && (
                    <Typography>
                      • CRC-16 CCITT: x¹⁶ + x¹² + x⁵ + 1 (0x1021)
                    </Typography>
                  )}
                  {values.algorithm === 'CRC32' && (
                    <Typography>
                      • CRC-32: x³² + x²⁶ + x²³ + x²² + x¹⁶ + x¹² + x¹¹ + x¹⁰ + x⁸ + x⁷ + x⁵ + x⁴ + x² + x + 1 (0x04C11DB7)
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <AboutToolSection
        title="CRC Calculator"
        description="The CRC (Cyclic Redundancy Check) Calculator is a reliable tool for generating and verifying 
          error-detecting codes commonly used in digital networks and storage devices. It supports multiple CRC 
          algorithms and input formats, making it versatile for various data integrity applications."
        features={[
          {
            title: 'Supported Algorithms',
            items: [
              'CRC-8 (8-bit)',
              'CRC-16 (16-bit)',
              'CRC-32 (32-bit)',
              'Custom polynomials and parameters'
            ]
          },
          {
            title: 'Input Formats',
            items: [
              'Text (ASCII/UTF-8)',
              'Hexadecimal',
              'Binary',
              'Real-time calculation'
            ]
          },
          {
            title: 'Output Options',
            items: [
              'Hexadecimal representation',
              'Binary format',
              'One-click copy functionality',
              'Detailed calculation steps'
            ]
          }
        ]}
        useCases={[
          'Data Transmission: Verify data integrity in communication protocols',
          'Storage Systems: Generate checksums for file verification',
          'Embedded Systems: Implement error detection in firmware updates',
          'Network Protocols: Validate packet contents and headers'
        ]}
      />
    </Container>
  );
};

export default CrcCalculator;
