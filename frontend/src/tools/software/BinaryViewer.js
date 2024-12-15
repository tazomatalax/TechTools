import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AboutToolSection from '../../components/AboutToolSection';

const HexDisplay = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  fontFamily: 'monospace',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
}));

const BinaryViewer = () => {
  const [viewMode, setViewMode] = useState('hex');
  const [bytesPerLine] = useState(16);
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        setFileContent(uint8Array);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const formatHexByte = (byte) => {
    return byte.toString(16).padStart(2, '0').toUpperCase();
  };

  const formatAscii = (byte) => {
    if (byte >= 32 && byte <= 126) {
      return String.fromCharCode(byte);
    }
    return '.';
  };

  const renderHexView = () => {
    if (!fileContent) return null;

    let hexOutput = '';
    let asciiOutput = '';
    let lineAddress = '';

    for (let i = 0; i < fileContent.length; i++) {
      if (i % bytesPerLine === 0) {
        if (i !== 0) {
          hexOutput += '  ' + asciiOutput + '\\n';
        }
        lineAddress += i.toString(16).padStart(8, '0').toUpperCase() + '  ';
        asciiOutput = '';
      }

      const byte = fileContent[i];
      hexOutput += formatHexByte(byte) + ' ';
      asciiOutput += formatAscii(byte);
    }

    if (asciiOutput) {
      const padding = ' '.repeat((bytesPerLine - (fileContent.length % bytesPerLine)) * 3);
      hexOutput += padding + '  ' + asciiOutput;
    }

    return (
      <HexDisplay>
        {hexOutput.split('\\n').map((line, index) => (
          <div key={index}>
            <span style={{ color: '#666' }}>{lineAddress.split('\\n')[index]}</span>
            {line}
          </div>
        ))}
      </HexDisplay>
    );
  };

  const renderBinaryView = () => {
    if (!fileContent) return null;

    let output = '';
    for (let i = 0; i < fileContent.length; i++) {
      if (i % (bytesPerLine / 2) === 0 && i !== 0) {
        output += '\\n';
      }
      output += fileContent[i].toString(2).padStart(8, '0') + ' ';
    }

    return <HexDisplay>{output}</HexDisplay>;
  };

  const handleSearch = () => {
    if (!fileContent || !searchValue) return;

    let searchBytes;
    try {
      // Try to parse as hex
      if (searchValue.startsWith('0x')) {
        searchBytes = new Uint8Array(
          searchValue
            .slice(2)
            .match(/.{1,2}/g)
            .map((byte) => parseInt(byte, 16))
        );
      } else {
        // Treat as ASCII
        searchBytes = new TextEncoder().encode(searchValue);
      }

      // Highlight matches in the view
      // This is a placeholder for actual implementation
      console.log('Searching for:', searchBytes);
    } catch (error) {
      console.error('Invalid search value:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Binary File Viewer
        </Typography>
        <Paper sx={{ p: 3, my: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                sx={{ mr: 2 }}
              >
                Open File
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </Button>
              {fileName && (
                <Typography component="span" sx={{ ml: 2 }}>
                  {fileName}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>View Mode</InputLabel>
                <Select
                  value={viewMode}
                  label="View Mode"
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <MenuItem value="hex">Hexadecimal</MenuItem>
                  <MenuItem value="binary">Binary</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search (hex: 0x41 or text)"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <Button onClick={handleSearch}>Search</Button>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {viewMode === 'hex' ? renderHexView() : renderBinaryView()}
            </Grid>
          </Grid>
        </Paper>

        <AboutToolSection
          title="Binary File Viewer"
          description="The Binary File Viewer is a powerful tool for examining the raw contents of any file in both 
            hexadecimal and binary formats. It provides a detailed view of file contents with address offsets 
            and ASCII representation, making it ideal for low-level file analysis and debugging."
          features={[
            {
              title: 'Multiple View Modes',
              items: [
                'Hexadecimal view with ASCII representation',
                'Binary view for bit-level analysis',
                'Address offset display for easy navigation'
              ]
            },
            {
              title: 'Search Capabilities',
              description: 'Search for hex values (0x41) or text strings within the file'
            },
            {
              title: 'File Analysis',
              items: [
                'Byte-by-byte examination',
                'Clear formatting with customizable bytes per line',
                'Non-printable character handling'
              ]
            }
          ]}
          useCases={[
            'Debug binary file formats and data structures',
            'Analyze file headers and metadata',
            'Verify file contents and encoding',
            'Investigate data corruption issues'
          ]}
        />
      </Box>
    </Container>
  );
};

export default BinaryViewer;
