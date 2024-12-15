import React, { useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  InputAdornment,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Icon from '@mdi/react';
import {
  Search as SearchIcon,
  Memory as ElectronicIcon,
  PowerInput as SignalIcon,
  Terminal as CommunicationIcon,
  Code as DeveloperIcon,
  Calculate as CalculatorIcon,
  Memory as PcbIcon,
  PowerInput as RegulatorIcon,
  DataObject as AdcIcon,
  Terminal as TerminalIcon,
  ManageSearch as RegexIcon,
  DataObject as JsonIcon,
  Palette as ColorIcon,
  Image as ImageIcon,
  Router as ModbusIcon,
} from '@mui/icons-material';
import {
  mdiOmega,
  mdiLedOn,
  mdiMathNormBox,
  mdiDivision,
  mdiChartBellCurveCumulative,
  mdiChartSankey,
  mdiChartBellCurve,
  mdiBatteryUnknown,
  mdiSwapHorizontal,
  mdiCodeBraces,
  mdiSineWave,
} from '@mdi/js';

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const ToolCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
    borderColor: theme.palette.primary.main,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const categories = [
  {
    title: 'Electronic Design',
    description: 'Resistors, PCB, components, and basic electronic calculations',
    icon: ElectronicIcon,
    path: '/electronic-tools',
    tags: ['resistor', 'ohm', 'led', 'pcb', 'battery']
  },
  {
    title: 'Signal & Power',
    description: 'Filters, power supplies, and signal processing tools',
    icon: mdiSineWave,
    isMdi: true,
    path: '/signal-power-tools',
    tags: ['filter', 'adc', 'dac', 'pwm', 'voltage', 'regulator']
  },
  {
    title: 'Data & Communication',
    description: 'Serial, Modbus, and data communication tools',
    icon: CommunicationIcon,
    path: '/communication-tools',
    tags: ['serial', 'modbus', 'terminal', 'ascii', 'crc']
  },
  {
    title: 'Developer Tools',
    description: 'Utilities for software development and data manipulation',
    icon: DeveloperIcon,
    path: '/developer-tools',
    tags: ['json', 'regex', 'converter', 'color', 'image']
  }
];

const allTools = [
  // Electronic Design Tools
  {
    title: "Ohm's Law Calculator",
    description: "Calculate voltage, current, and resistance using Ohm's Law",
    icon: mdiOmega,
    isMdi: true,
    path: '/electronic-tools/ohms-law',
    category: 'Electronic Design',
    tags: ['voltage', 'current', 'resistance', 'power', 'ohm', 'electronic', 'calculator', 'circuit', 'electrical', 'V=IR', 'P=VI']
  },
  {
    title: "LED Series Resistor Calculator",
    description: "Calculate the required series resistor for LED circuits",
    icon: mdiLedOn,
    isMdi: true,
    path: '/electronic-tools/led-resistor',
    category: 'Electronic Design',
    tags: ['led', 'current limiting', 'resistor', 'electronic', 'light', 'diode', 'forward voltage', 'series', 'calculator']
  },
  {
    title: "Resistor Value Decoder",
    description: "Decode resistor color codes and calculate resistance values",
    icon: mdiMathNormBox,
    isMdi: true,
    path: '/electronic-tools/resistor-calculator',
    category: 'Electronic Design',
    tags: ['resistor', 'color code', 'resistance', 'electronic', 'bands', 'ohm', 'tolerance', 'decoder', 'calculator']
  },
  {
    title: "Voltage Divider Calculator",
    description: "Calculate output voltage and resistor values for voltage dividers",
    icon: mdiDivision,
    isMdi: true,
    path: '/electronic-tools/voltage-divider',
    category: 'Electronic Design',
    tags: ['voltage', 'divider', 'resistor', 'electronic', 'ratio', 'potential', 'calculator', 'circuit']
  },
  {
    title: "Battery Life Calculator",
    description: "Estimate battery life based on load current and battery capacity",
    icon: mdiBatteryUnknown,
    isMdi: true,
    path: '/electronic-tools/battery-life',
    category: 'Electronic Design',
    tags: ['battery', 'power', 'capacity', 'current', 'life', 'runtime', 'mAh', 'calculator', 'duration']
  },
  {
    title: "PCB Trace Calculator",
    description: "Calculate minimum trace width for PCB design",
    icon: PcbIcon,
    path: '/electronic-tools/pcb-trace',
    category: 'Electronic Design',
    tags: ['pcb', 'trace', 'width', 'current', 'circuit board', 'copper', 'design', 'calculator', 'layout']
  },
  // Signal & Power Tools
  {
    title: "RC Filter Calculator",
    description: "Design and analyze RC low-pass and high-pass filters",
    icon: mdiChartSankey,
    isMdi: true,
    path: '/signal-power-tools/rc-filter',
    category: 'Signal & Power',
    tags: ['filter', 'capacitor', 'resistor', 'frequency', 'signal', 'low-pass', 'high-pass', 'cutoff', 'RC', 'time constant']
  },
  {
    title: "PWM/DAC Calculator",
    description: "Calculate PWM parameters and analyze DAC configurations",
    icon: mdiChartBellCurve,
    isMdi: true,
    path: '/signal-power-tools/pwm-dac',
    category: 'Signal & Power',
    tags: ['pwm', 'dac', 'conversion', 'signal', 'digital', 'analog', 'duty cycle', 'frequency', 'resolution', 'pulse']
  },
  {
    title: "ADC Calculator",
    description: "Design voltage dividers for ADC inputs and analyze measurement ranges",
    icon: AdcIcon,
    path: '/signal-power-tools/adc-calculator',
    category: 'Signal & Power',
    tags: ['adc', 'analog', 'digital', 'conversion', 'signal', 'resolution', 'voltage', 'range', 'bits', 'sampling']
  },
  // Communication Tools
  {
    title: "Serial Terminal",
    description: "Monitor and analyze serial communication with customizable settings",
    icon: TerminalIcon,
    path: '/communication-tools/serial-terminal',
    category: 'Data & Communication',
    tags: ['serial', 'uart', 'communication', 'terminal', 'COM port', 'RS232', 'USB', 'baud rate', 'monitor', 'debug']
  },
  {
    title: "Modbus Terminal",
    description: "Communicate with and test Modbus RTU devices",
    icon: ModbusIcon,
    path: '/communication-tools/modbus-terminal',
    category: 'Data & Communication',
    tags: ['modbus', 'rtu', 'communication', 'industrial', 'protocol', 'serial', 'register', 'slave', 'master', 'automation']
  },
  {
    title: "Binary Viewer",
    description: "View and analyze binary data in multiple formats with real-time conversion",
    icon: mdiCodeBraces,
    isMdi: true,
    path: '/communication-tools/binary-viewer',
    category: 'Data & Communication',
    tags: ['binary', 'hex', 'data', 'analysis', 'viewer', 'hexadecimal', 'bytes', 'decode', 'format', 'converter']
  },
  {
    title: "ASCII Table",
    description: "Complete ASCII character reference with decimal, hex, and binary values",
    icon: mdiCodeBraces,
    isMdi: true,
    path: '/communication-tools/ascii-table',
    category: 'Data & Communication',
    tags: ['ascii', 'characters', 'encoding', 'text', 'table', 'reference', 'hex', 'decimal', 'binary', 'unicode']
  },
  // Developer Tools
  {
    title: "Base Converter",
    description: "Convert numbers between decimal, binary, hex, and octal with additional operations",
    icon: CalculatorIcon,
    path: '/developer-tools/base-converter',
    category: 'Developer Tools',
    tags: ['binary', 'hex', 'decimal', 'conversion', 'developer', 'base', 'octal', 'number', 'calculator', 'radix']
  },
  {
    title: "Byte Converter",
    description: "Convert between raw bytes and various numeric types with endianness options",
    icon: mdiSwapHorizontal,
    isMdi: true,
    path: '/developer-tools/byte-converter',
    category: 'Developer Tools',
    tags: ['bytes', 'integers', 'floats', 'conversion', 'endian', 'little-endian', 'big-endian', 'data', 'format']
  },
  {
    title: "Regex Tester",
    description: "Test and debug regular expressions with real-time matching and explanation",
    icon: RegexIcon,
    path: '/developer-tools/regex-tester',
    category: 'Developer Tools',
    tags: ['regex', 'regular expression', 'pattern', 'matching', 'developer', 'test', 'debug', 'string', 'search', 'replace']
  },
  {
    title: "JSON Formatter",
    description: "Format, validate, and analyze JSON data with syntax highlighting",
    icon: JsonIcon,
    path: '/developer-tools/json-formatter',
    category: 'Developer Tools',
    tags: ['json', 'formatter', 'validator', 'pretty print', 'syntax', 'object', 'array', 'data', 'structure', 'parse']
  },
  {
    title: "Color Picker",
    description: "Select and convert colors between RGB, HEX, HSL, and other formats",
    icon: ColorIcon,
    path: '/developer-tools/color-picker',
    category: 'Developer Tools',
    tags: ['color', 'picker', 'rgb', 'hex', 'hsl', 'hsv', 'palette', 'web', 'css', 'design']
  },
  {
    title: "Image Converter",
    description: "Convert images between formats and perform basic image operations",
    icon: ImageIcon,
    path: '/developer-tools/image-converter',
    category: 'Developer Tools',
    tags: ['image', 'conversion', 'format', 'png', 'jpg', 'jpeg', 'gif', 'resize', 'compress', 'convert']
  }
];

function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (!normalizedQuery) {
      return [];
    }
    return allTools.filter(tool =>
      tool.title.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery) ||
      tool.category.toLowerCase().includes(normalizedQuery) ||
      tool.tags.some(tag => tag.includes(normalizedQuery))
    );
  }, [searchQuery]);

  const hasSearchResults = searchQuery.trim() !== '' && filteredTools.length > 0;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Tech Tools
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Find the right tool for your project
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tools by name, category, or function..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ maxWidth: 600, mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Collapse in={hasSearchResults}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Search Results
          </Typography>
          <Grid container spacing={3}>
            {filteredTools.map((tool) => (
              <Grid item xs={12} sm={6} md={4} key={tool.path}>
                <ToolCard component={RouterLink} to={tool.path} sx={{ textDecoration: 'none' }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <IconWrapper>
                      {tool.isMdi ? (
                        <Icon path={tool.icon} size={1.5} />
                      ) : (
                        <tool.icon sx={{ fontSize: 'inherit' }} />
                      )}
                    </IconWrapper>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {tool.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {tool.description}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {tool.category}
                    </Typography>
                  </CardContent>
                </ToolCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>

      <Collapse in={!hasSearchResults}>
        <Grid container spacing={4} justifyContent="center">
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={6} key={category.title}>
              <CategoryCard
                component={RouterLink}
                to={category.path}
                sx={{ textDecoration: 'none' }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconWrapper>
                    {category.isMdi ? (
                      <Icon path={category.icon} size={1.5} />
                    ) : (
                      <category.icon sx={{ fontSize: 'inherit' }} />
                    )}
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {category.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Container>
  );
}

export default Home;
