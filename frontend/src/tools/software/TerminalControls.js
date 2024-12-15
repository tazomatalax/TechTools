import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
  Paper,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { styled, alpha } from '@mui/material/styles';
import AboutToolSection from '../../components/AboutToolSection';

// Mini terminal for previewing control sequences
const TerminalPreview = styled(Box)(({ theme }) => ({
  backgroundColor: '#1e1e1e',
  color: '#fff',
  fontFamily: 'monospace',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  minHeight: '40px',
  maxHeight: '40px',
  position: 'relative',
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
  display: 'flex',
  alignItems: 'center',
  '& .cursor': {
    animation: 'blink 1s step-end infinite',
  },
  '@keyframes blink': {
    '50%': {
      opacity: 0,
    },
  },
}));

const TerminalString = styled(Box)(({ theme }) => ({
  backgroundColor: '#1e1e1e',
  color: '#fff',
  fontFamily: 'monospace',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& code': {
    flex: 1,
    overflow: 'auto',
  },
}));

const PreviewControls = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
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

const ColorBox = styled(Box)(({ color, selected }) => ({
  width: '24px',
  height: '24px',
  backgroundColor: color,
  border: selected ? '2px solid white' : '1px solid rgba(255,255,255,0.1)',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    border: '2px solid white',
    zIndex: 1,
  },
}));

const ColorPalette = ({ selectedColor, onColorSelect }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleColorHover = (event, colorIndex, colorHex) => {
    setTooltipContent(`Color ${colorIndex} (${colorHex})`);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setShowTooltip(true);
  };

  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      <Typography variant="subtitle2" gutterBottom>
        Standard Colors (0-15)
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 24px)', gap: 0.5, mb: 2 }}>
        {Array.from({ length: 16 }, (_, i) => (
          <Tooltip key={i} title={`Color ${i} (${colors256[i]})`}>
            <ColorBox
              color={colors256[i]}
              selected={selectedColor === i.toString()}
              onClick={() => onColorSelect(i.toString())}
            />
          </Tooltip>
        ))}
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Color Cube (16-231)
      </Typography>
      <Box sx={{ mb: 2 }}>
        {[0, 1, 2, 3, 4, 5].map(r => (
          <Box key={r} sx={{ display: 'flex', mb: 0.5 }}>
            {[0, 1, 2, 3, 4, 5].map(g => (
              <Box key={g} sx={{ display: 'flex', gap: 0.5, mr: 0.5 }}>
                {[0, 1, 2, 3, 4, 5].map(b => {
                  const colorIndex = 16 + (r * 36) + (g * 6) + b;
                  return (
                    <Tooltip key={b} title={`Color ${colorIndex} (${colors256[colorIndex]})`}>
                      <ColorBox
                        color={colors256[colorIndex]}
                        selected={selectedColor === colorIndex.toString()}
                        onClick={() => onColorSelect(colorIndex.toString())}
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Grayscale (232-255)
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(24, 24px)', gap: 0.5 }}>
        {Array.from({ length: 24 }, (_, i) => {
          const colorIndex = 232 + i;
          return (
            <Tooltip key={i} title={`Color ${colorIndex} (${colors256[colorIndex]})`}>
              <ColorBox
                color={colors256[colorIndex]}
                selected={selectedColor === colorIndex.toString()}
                onClick={() => onColorSelect(colorIndex.toString())}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

// ANSI color mapping
const ansiColors = {
  0: '#000000',   // Black
  1: '#cd0000',   // Red
  2: '#00cd00',   // Green
  3: '#cdcd00',   // Yellow
  4: '#0000ee',   // Blue
  5: '#cd00cd',   // Magenta
  6: '#00cdcd',   // Cyan
  7: '#e5e5e5',   // White
  // Bright variants
  8: '#7f7f7f',   // Bright Black (Gray)
  9: '#ff0000',   // Bright Red
  10: '#00ff00',  // Bright Green
  11: '#ffff00',  // Bright Yellow
  12: '#5c5cff',  // Bright Blue
  13: '#ff00ff',  // Bright Magenta
  14: '#00ffff',  // Bright Cyan
  15: '#ffffff',  // Bright White
};

// Generate 256 color palette
const generate256Colors = () => {
  const colors = { ...ansiColors };
  
  // Standard 16 colors are already defined above

  // 216 colors (6x6x6 cube)
  let i = 16;
  for (let r = 0; r < 6; r++) {
    for (let g = 0; g < 6; g++) {
      for (let b = 0; b < 6; b++) {
        colors[i] = `#${(r ? r * 40 + 55 : 0).toString(16).padStart(2, '0')}${(g ? g * 40 + 55 : 0).toString(16).padStart(2, '0')}${(b ? b * 40 + 55 : 0).toString(16).padStart(2, '0')}`;
        i++;
      }
    }
  }

  // Grayscale colors (24 shades)
  for (let gray = 0; gray < 24; gray++) {
    const value = gray * 10 + 8;
    const hex = value.toString(16).padStart(2, '0');
    colors[i] = `#${hex}${hex}${hex}`;
    i++;
  }

  return colors;
};

const colors256 = generate256Colors();

// Terminal control sequence data
const controlSequences = {
  cursor: [
    {
      name: 'Cursor Up',
      sequence: '\\x1b[{n}A',
      rawSequence: '\x1b[{n}A',
      description: 'Move cursor up n lines',
      example: '\\x1b[2A',
      params: [{ name: 'n', description: 'Number of lines', default: '1' }],
      support: 'Universal',
    },
    {
      name: 'Cursor Down',
      sequence: '\\x1b[{n}B',
      rawSequence: '\x1b[{n}B',
      description: 'Move cursor down n lines',
      example: '\\x1b[2B',
      params: [{ name: 'n', description: 'Number of lines', default: '1' }],
      support: 'Universal',
    },
    {
      name: 'Cursor Forward',
      sequence: '\\x1b[{n}C',
      rawSequence: '\x1b[{n}C',
      description: 'Move cursor forward n columns',
      example: '\\x1b[2C',
      params: [{ name: 'n', description: 'Number of columns', default: '1' }],
      support: 'Universal',
    },
    {
      name: 'Cursor Back',
      sequence: '\\x1b[{n}D',
      rawSequence: '\x1b[{n}D',
      description: 'Move cursor back n columns',
      example: '\\x1b[2D',
      params: [{ name: 'n', description: 'Number of columns', default: '1' }],
      support: 'Universal',
    },
    {
      name: 'Cursor Position',
      sequence: '\\x1b[{row};{col}H',
      rawSequence: '\x1b[{row};{col}H',
      description: 'Move cursor to specific position',
      example: '\\x1b[2;2H',
      params: [
        { name: 'row', description: 'Row number (1-based)', default: '1' },
        { name: 'col', description: 'Column number (1-based)', default: '1' },
      ],
      support: 'Universal',
    },
  ],
  clear: [
    {
      name: 'Clear Screen',
      sequence: '\\x1b[2J',
      rawSequence: '\x1b[2J',
      description: 'Clear entire screen',
      example: '\\x1b[2J',
      params: [],
      support: 'Universal',
    },
    {
      name: 'Clear Line',
      sequence: '\\x1b[2K',
      rawSequence: '\x1b[2K',
      description: 'Clear entire line',
      example: '\\x1b[2K',
      params: [],
      support: 'Universal',
    },
  ],
  colors: [
    {
      name: 'Foreground Color',
      sequence: '\\x1b[38;5;{n}m',
      rawSequence: '\x1b[38;5;{n}m',
      description: 'Set text color (256 colors)',
      example: '\\x1b[38;5;196m',
      params: [{ name: 'n', description: 'Color number (0-255)', default: '0' }],
      support: 'Most modern terminals',
    },
    {
      name: 'Background Color',
      sequence: '\\x1b[48;5;{n}m',
      rawSequence: '\x1b[48;5;{n}m',
      description: 'Set background color (256 colors)',
      example: '\\x1b[48;5;196m',
      params: [{ name: 'n', description: 'Color number (0-255)', default: '0' }],
      support: 'Most modern terminals',
    },
    {
      name: 'Reset Colors',
      sequence: '\\x1b[0m',
      rawSequence: '\x1b[0m',
      description: 'Reset all colors and styles',
      example: '\\x1b[0m',
      params: [],
      support: 'Universal',
    },
  ],
  style: [
    {
      name: 'Bold',
      sequence: '\\x1b[1m',
      rawSequence: '\x1b[1m',
      description: 'Bold text',
      example: '\\x1b[1m',
      params: [],
      support: 'Universal',
    },
    {
      name: 'Dim',
      sequence: '\\x1b[2m',
      rawSequence: '\x1b[2m',
      description: 'Dim text',
      example: '\\x1b[2m',
      params: [],
      support: 'Most terminals',
    },
    {
      name: 'Italic',
      sequence: '\\x1b[3m',
      rawSequence: '\x1b[3m',
      description: 'Italic text',
      example: '\\x1b[3m',
      params: [],
      support: 'Most modern terminals',
    },
    {
      name: 'Underline',
      sequence: '\\x1b[4m',
      rawSequence: '\x1b[4m',
      description: 'Underlined text',
      example: '\\x1b[4m',
      params: [],
      support: 'Universal',
    },
  ],
};

const TerminalControls = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewText, setPreviewText] = useState('Hello, Terminal!');
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const [copySuccess, setCopySuccess] = useState(false);

  const applySequence = (sequence, params = {}) => {
    let result = sequence.rawSequence;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`{${key}}`, value);
    });
    return result;
  };

  const handlePreviewClick = (sequence, defaultParams = {}) => {
    setSelectedSequence(sequence);
    setParamValues(defaultParams);
  };

  const handleParamChange = (paramName, value) => {
    setParamValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const getTerminalString = () => {
    if (!selectedSequence) return previewText;
    const before = selectedSequence.rawSequence.includes('{row}') ? '\x1b[H' : '';
    const reset = '\x1b[0m';
    return before + applySequence(selectedSequence, paramValues) + previewText + reset;
  };

  const getVisualPreview = () => {
    if (!selectedSequence) return previewText;

    // Process the control sequences for visual display
    let preview = previewText;
    const seq = applySequence(selectedSequence, paramValues);

    // Handle different types of sequences
    if (selectedSequence.name.includes('Foreground Color')) {
      const colorIndex = parseInt(paramValues.n) || 0;
      return <span style={{ color: colors256[colorIndex] }}>{preview}</span>;
    } else if (selectedSequence.name.includes('Background Color')) {
      const colorIndex = parseInt(paramValues.n) || 0;
      return <span style={{ backgroundColor: colors256[colorIndex] }}>{preview}</span>;
    } else if (selectedSequence.name === 'Bold') {
      return <span style={{ fontWeight: 'bold' }}>{preview}</span>;
    } else if (selectedSequence.name === 'Italic') {
      return <span style={{ fontStyle: 'italic' }}>{preview}</span>;
    } else if (selectedSequence.name === 'Underline') {
      return <span style={{ textDecoration: 'underline' }}>{preview}</span>;
    } else if (selectedSequence.name.includes('Cursor')) {
      // For cursor movements, show position indicator
      const pos = paramValues.n || 1;
      return <span>{'\u2192'.repeat(pos)} {preview}</span>;
    }

    return preview;
  };

  // Convert escape sequences to printable representation
  const toPrintableString = (str) => {
    return str.replace(/\x1B/g, '\\x1b');
  };

  const categories = Object.keys(controlSequences);

  const filteredSequences = useMemo(() => {
    const search = searchTerm.toLowerCase();
    const result = {};
    
    Object.entries(controlSequences).forEach(([category, sequences]) => {
      const filtered = sequences.filter(seq =>
        seq.name.toLowerCase().includes(search) ||
        seq.description.toLowerCase().includes(search) ||
        seq.sequence.toLowerCase().includes(search)
      );
      if (filtered.length > 0) {
        result[category] = filtered;
      }
    });
    
    return result;
  }, [searchTerm]);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Terminal Control Sequences
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Search sequences"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>

        {Object.entries(filteredSequences).map(([category, sequences]) => (
          <Accordion
            key={category}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                {category}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Sequence</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Parameters</TableCell>
                      <TableCell>Support</TableCell>
                      <TableCell>Preview</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sequences.map((seq) => (
                      <TableRow key={seq.name}>
                        <TableCell>{seq.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <code>{seq.sequence}</code>
                            <CopyButton
                              text={seq.sequence}
                              tooltip="Copy sequence"
                            />
                            <CopyButton
                              text={seq.rawSequence}
                              tooltip="Copy raw sequence"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{seq.description}</TableCell>
                        <TableCell>
                          {seq.params.map((param) => (
                            <Chip
                              key={param.name}
                              label={`${param.name}=${param.default}`}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </TableCell>
                        <TableCell>{seq.support}</TableCell>
                        <TableCell>
                          <Tooltip title="Try in preview">
                            <IconButton
                              size="small"
                              onClick={() => handlePreviewClick(seq, 
                                Object.fromEntries(seq.params.map(p => [p.name, p.default]))
                              )}
                            >
                              <PlayArrowIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Terminal String
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Test text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
          {selectedSequence && (
            <PreviewControls>
              <Typography variant="subtitle1">
                {selectedSequence.name}:
              </Typography>
              {selectedSequence.params.map((param) => (
                <Box key={param.name}>
                  <TextField
                    label={param.name}
                    size="small"
                    value={paramValues[param.name] || param.default}
                    onChange={(e) => handleParamChange(param.name, e.target.value)}
                    sx={{ width: 100 }}
                  />
                  {(selectedSequence.name.includes('Color') && param.name === 'n') && (
                    <ColorPalette
                      selectedColor={paramValues[param.name] || param.default}
                      onColorSelect={(color) => handleParamChange(param.name, color)}
                    />
                  )}
                </Box>
              ))}
            </PreviewControls>
          )}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Code String:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={toPrintableString(getTerminalString())}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          edge="end"
                          onClick={() => {
                            navigator.clipboard.writeText(toPrintableString(getTerminalString()));
                            setCopySuccess(true);
                            setTimeout(() => setCopySuccess(false), 2000);
                          }}
                        >
                          {copySuccess ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Visual Preview
          </Typography>
          <TerminalPreview>
            {getVisualPreview()}
          </TerminalPreview>
        </Box>
      </Paper>

      <AboutToolSection
        title="Terminal Controls"
        description="Take the pain out of writing terminal control sequences and take back control of your terminal! This interactive tool helps developers work with ANSI/VT100 terminal control sequences, providing instant visual feedback and ready-to-use code snippets."
        features={[
          {
            title: 'Interactive Controls',
            items: [
              'Visual preview of control sequences in real-time',
              'Categorized sequences for cursor movement, colors, and text styling',
              'Adjustable parameters with immediate visual feedback',
              'Easy-to-copy code strings in proper escape sequence format'
            ]
          },
          {
            title: 'Color Support',
            items: [
              'Complete 256-color palette visualization',
              'Standard 16-color ANSI support',
              'RGB color cube for precise color selection',
              'Grayscale ramp from black to white'
            ]
          },
          {
            title: 'Developer Experience',
            items: [
              'Search and filter control sequences by name or description',
              'Copy-ready code strings for direct use in your projects',
              'Comprehensive sequence descriptions and usage examples',
              'Modern, intuitive interface for rapid sequence testing'
            ]
          }
        ]}
      />
    </Box>
  );
};

export default TerminalControls;
