import React from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Terminal as TerminalIcon,
  Calculate as CalculatorIcon,
  CompareArrows as SwapIcon,
  Search as MagnifyIcon,
  CheckCircle as CheckIcon,
  Memory as GateIcon,
  DataObject as JsonIcon,
  ManageSearch as RegexIcon,
  Palette as ColorIcon,
  Image as ImageIcon,
  Code as CodeBracesIcon,
  DataObject as DataObjectIcon,
} from '@mui/icons-material';
import BaseConverter from '../tools/software/BaseConverter';
import CrcCalculator from '../tools/software/CrcCalculator';
import SerialTerminal from '../tools/software/SerialTerminal';
import ModbusTerminal from '../tools/software/ModbusTerminal';
import ByteConverter from '../tools/software/ByteConverter';
import LogicGateSimulator from '../tools/software/LogicGateSimulator';
import RegexTester from '../tools/software/RegexTester';
import JsonFormatter from '../tools/software/JsonFormatter';
import BinaryViewer from '../tools/software/BinaryViewer';
import ColorPicker from '../tools/software/ColorPicker';
import ImageConverter from '../tools/software/ImageConverter';
import AsciiTable from '../tools/software/AsciiTable';
import TerminalControls from '../tools/software/TerminalControls';

const ToolCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const ToolCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  marginBottom: theme.spacing(1),
}));

const SubcategoryTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const ToolIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  '& > svg': {
    fontSize: 28,
  },
}));

const SoftwareTools = () => {
  const categories = [
    {
      title: "Development Tools",
      tools: [
        {
          title: "Serial Terminal",
          description: "Connect to COM ports, monitor serial data, and analyze communication patterns",
          path: "serial-terminal",
          component: SerialTerminal,
          icon: <TerminalIcon />,
        },
        {
          title: "Modbus Terminal",
          description: "Communicate with Modbus devices, read/write registers, and monitor Modbus RTU traffic",
          path: "modbus-terminal",
          component: ModbusTerminal,
          icon: <TerminalIcon />,
        },
        {
          title: "Regex Tester",
          description: "Test and debug regular expressions with real-time matching",
          path: "regex-tester",
          component: RegexTester,
          icon: <RegexIcon />,
        },
        {
          title: "JSON Formatter",
          description: "Format, validate, and analyze JSON data structures",
          path: "json-formatter",
          component: JsonFormatter,
          icon: <JsonIcon />,
        },
        {
          title: "ASCII Table",
          description: "Interactive ASCII reference table with hex, binary, and character conversion tools",
          path: "ascii-table",
          component: AsciiTable,
          icon: <DataObjectIcon />,
        },
        {
          title: "Terminal Controls",
          description: "Interactive reference for ANSI terminal control sequences with live preview",
          path: "terminal-controls",
          component: TerminalControls,
          icon: <TerminalIcon />,
        },
      ],
    },
    {
      title: "Data Conversion",
      tools: [
        {
          title: "Multi-Base Calculator",
          description: "Perform arithmetic and bitwise operations in decimal, binary, and hexadecimal",
          path: "base-converter",
          component: BaseConverter,
          icon: <CalculatorIcon />,
        },
        {
          title: "Byte Converter",
          description: "Convert between raw bytes and various numeric types (integers, floats) with endianness support",
          path: "byte-converter",
          component: ByteConverter,
          icon: <SwapIcon />,
        },
        {
          title: "Binary Viewer",
          description: "View and analyze binary data in multiple formats",
          path: "binary-viewer",
          component: BinaryViewer,
          icon: <MagnifyIcon />,
        },
      ],
    },
    {
      title: "Media & Graphics",
      tools: [
        {
          title: "Color Picker",
          description: "Select and convert colors between different formats",
          path: "color-picker",
          component: ColorPicker,
          icon: <ColorIcon />,
        },
        {
          title: "Image Converter",
          description: "Convert images between different formats and analyze image data",
          path: "image-converter",
          component: ImageConverter,
          icon: <ImageIcon />,
        },
      ],
    },
    {
      title: "Digital Logic",
      tools: [
        {
          title: "CRC Calculator",
          description: "Calculate CRC checksums using various algorithms and input formats",
          path: "crc-calculator",
          component: CrcCalculator,
          icon: <CheckIcon />,
        },
        {
          title: "Logic Gate Simulator",
          description: "Simulate and analyze digital logic circuits",
          path: "logic-gate-simulator",
          component: LogicGateSimulator,
          icon: <GateIcon />,
        },
      ],
    },
  ];

  // Main tools listing page
  const ToolsList = () => (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <CategoryTitle variant="h3" component="h1" gutterBottom>
          Software Tools
        </CategoryTitle>
        <Typography variant="h6" color="text.secondary" paragraph>
          Essential utilities for software development and data analysis
        </Typography>
      </Box>

      {categories.map((category) => (
        <Box key={category.title} sx={{ mb: 6 }}>
          <SubcategoryTitle variant="h5" gutterBottom>
            {category.title}
          </SubcategoryTitle>
          <Grid container spacing={3}>
            {category.tools.map((tool) => (
              <Grid item xs={12} sm={6} md={4} key={tool.title}>
                <ToolCard component={RouterLink} to={tool.path} sx={{ textDecoration: 'none' }}>
                  <ToolCardContent>
                    <ToolIcon>
                      {tool.icon}
                    </ToolIcon>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {tool.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tool.description}
                    </Typography>
                  </ToolCardContent>
                </ToolCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );

  // Flatten tools array for routing
  const allTools = categories.reduce((acc, category) => [...acc, ...category.tools], []);

  return (
    <Routes>
      <Route path="/" element={<ToolsList />} />
      {allTools.map((tool) => (
        <Route
          key={tool.path}
          path={tool.path}
          element={<tool.component />}
        />
      ))}
    </Routes>
  );
};

export default SoftwareTools;
