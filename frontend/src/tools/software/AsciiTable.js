import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { styled, alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import AboutToolSection from '../../components/AboutToolSection';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  width: '16.66%', // Make all columns equal width
  '&.control-char': {
    backgroundColor: alpha(theme.palette.error.light, 0.2), // Increased from 0.1
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.light, 0.3),
    }
  },
  '&.printable-char': {
    backgroundColor: alpha(theme.palette.success.light, 0.2), // Increased from 0.1
    '&:hover': {
      backgroundColor: alpha(theme.palette.success.light, 0.3),
    }
  },
}));

const CopyButton = ({ text, tooltip }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Tooltip title={tooltip}>
      <IconButton size="small" onClick={handleCopy} sx={{ ml: 1, p: 0.5 }}>
        <ContentCopyIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

const AsciiTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('decimal');
  const [order, setOrder] = useState('asc');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Handle special sorting cases
      if (orderBy === 'char') {
        aValue = a.isControl ? a.char : a.escapeSequence || a.char;
        bValue = b.isControl ? b.char : b.escapeSequence || b.char;
      } else if (orderBy === 'escapeSequence') {
        aValue = a.escapeSequence || '';
        bValue = b.escapeSequence || '';
      }

      // Compare the values
      if (bValue < aValue) {
        return order === 'asc' ? 1 : -1;
      }
      if (bValue > aValue) {
        return order === 'asc' ? -1 : 1;
      }
      return 0;
    });
  };

  const asciiData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 128; i++) {
      const char = String.fromCharCode(i);
      const hex = `0x${i.toString(16).padStart(2, '0').toUpperCase()}`;
      const binary = i.toString(2).padStart(8, '0');
      const isControl = i < 32 || i === 127;
      
      let displayChar = char;
      let escapeSequence = '';
      let description = 'Printable Character';
      
      // Handle special characters
      switch (i) {
        case 0: 
          displayChar = 'NUL'; 
          escapeSequence = '\\0'; 
          description = 'Control Character - Null terminator';
          break;
        case 9: 
          displayChar = '⇥'; 
          escapeSequence = '\\t'; 
          description = 'Control Character - Horizontal Tab';
          break;
        case 10: 
          displayChar = '⏎'; 
          escapeSequence = '\\n'; 
          description = 'Control Character - Line Feed (New Line)';
          break;
        case 13: 
          displayChar = '↵'; 
          escapeSequence = '\\r'; 
          description = 'Control Character - Carriage Return';
          break;
        case 27: 
          displayChar = 'ESC'; 
          escapeSequence = '\\e'; 
          description = 'Control Character - Escape';
          break;
        case 32: 
          displayChar = '␣'; 
          escapeSequence = ' '; 
          description = 'Space Character';
          break;
        case 127: 
          displayChar = 'DEL'; 
          escapeSequence = ''; 
          description = 'Control Character - Delete';
          break;
        default:
          if (i < 32) {
            displayChar = `^${String.fromCharCode(i + 64)}`;
            escapeSequence = '';
            description = `Control Character - ${String.fromCharCode(i + 64)} Control`;
          } else {
            displayChar = char;
            escapeSequence = '';
            description = 'Printable Character';
          }
      }

      data.push({
        decimal: i,
        hex,
        binary,
        char: displayChar,
        escapeSequence,
        isControl,
        description
      });
    }
    return data;
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortData([...asciiData]);
    const search = searchTerm.toLowerCase();
    const filtered = asciiData.filter(row => 
      row.decimal.toString().includes(search) ||
      row.hex.toLowerCase().includes(search) ||
      row.binary.includes(search) ||
      row.char.toLowerCase().includes(search) ||
      (row.escapeSequence && row.escapeSequence.toLowerCase().includes(search))
    );
    return sortData([...filtered]);
  }, [asciiData, searchTerm, order, orderBy]);

  const SortableTableCell = ({ id, label }) => (
    <TableCell
      sortDirection={orderBy === id ? order : false}
      align="left"
    >
      <TableSortLabel
        active={orderBy === id}
        direction={orderBy === id ? order : 'asc'}
        onClick={() => handleRequestSort(id)}
      >
        {label}
        {orderBy === id ? (
          <Box component="span" sx={visuallyHidden}>
            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </Box>
        ) : null}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Interactive ASCII Table
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Search (decimal, hex, binary, or character)"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Click column headers to sort. Click the copy icons to copy values in different formats. Control characters are highlighted in red.
        </Typography>
      </Box>
      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <SortableTableCell id="decimal" label="Decimal" />
              <SortableTableCell id="hex" label="Hex" />
              <SortableTableCell id="binary" label="Binary" />
              <SortableTableCell id="char" label="Character" />
              <SortableTableCell id="escapeSequence" label="Escape Sequence" />
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.decimal}>
                <StyledTableCell
                  className={row.isControl ? 'control-char' : 'printable-char'}
                >
                  {row.decimal}
                  <CopyButton 
                    text={row.decimal.toString()} 
                    tooltip="Copy decimal" 
                  />
                </StyledTableCell>
                <StyledTableCell
                  className={row.isControl ? 'control-char' : 'printable-char'}
                >
                  {row.hex}
                  <CopyButton 
                    text={row.hex} 
                    tooltip="Copy hex" 
                  />
                </StyledTableCell>
                <StyledTableCell
                  className={row.isControl ? 'control-char' : 'printable-char'}
                >
                  {row.binary}
                  <CopyButton 
                    text={row.binary} 
                    tooltip="Copy binary" 
                  />
                </StyledTableCell>
                <StyledTableCell
                  className={row.isControl ? 'control-char' : 'printable-char'}
                >
                  {row.char}
                  {(row.escapeSequence && row.decimal !== 32) && (
                    <CopyButton 
                      text={row.escapeSequence} 
                      tooltip="Copy character" 
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell
                  className={row.isControl ? 'control-char' : 'printable-char'}
                >
                  {row.escapeSequence}
                  {(row.escapeSequence && row.decimal !== 32) && (
                    <CopyButton 
                      text={row.escapeSequence} 
                      tooltip="Copy escape sequence" 
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell
                  className={row.isControl ? 'control-char' : 'printable-char'}
                >
                  {row.description}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AboutToolSection
        title="ASCII Table"
        description="The ASCII Table is a comprehensive reference tool for viewing and working with ASCII characters. It provides detailed information about all 128 ASCII characters, including their decimal, hexadecimal, and binary representations, along with escape sequences and descriptions."
        features={[
          {
            title: 'Interactive Features',
            items: [
              'Sort by any column (decimal, hex, binary, character, or escape sequence)',
              'Search across all representations',
              'One-click copy for any value',
              'Color-coded display distinguishing control characters from printable ones'
            ]
          },
          {
            title: 'Character Information',
            items: [
              'Decimal (0-127)',
              'Hexadecimal (0x00-0x7F)',
              'Binary (8-bit representation)',
              'Visual character representation',
              'Escape sequences for special characters',
              'Detailed character descriptions'
            ]
          }
        ]}
        useCases={[
          'Character encoding and decoding',
          'Programming string manipulation',
          'Debugging text data',
          'Learning about control characters',
          'Converting between different number bases'
        ]}
      />
    </Box>
  );
};

export default AsciiTable;
