import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PrecisionManufacturing as CircuitIcon,
  Code as CodeIcon,
  PowerInput as RegulatorIcon,
  Memory as PcbIcon,
  DataObject as AdcIcon,
  Terminal as TerminalIcon,
  Calculate as BaseConverterIcon,
  Search as MagnifyIcon,
  ManageSearch as RegexIcon,
  DataObject as JsonIcon,
  Palette as ColorPickerIcon,
  Image as ImageConverterIcon,
  Router as ModbusIcon,
} from '@mui/icons-material';
import Icon from '@mdi/react';
import { 
  mdiOmega,
  mdiLedOn,
  mdiMathNormBox,
  mdiDivision,
  mdiChartBellCurveCumulative,
  mdiChartSankey,
  mdiChartBellCurve,
  mdiBatteryUnknown,
  mdiSwapHorizontal
} from '@mdi/js';

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

const MdiToolIcon = styled(Icon)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const Home = () => {
  const categories = [
    {
      title: 'Circuit Dev Tools',
      description: 'Design and analyze electronic circuits with our comprehensive calculator suite.',
      icon: <CircuitIcon sx={{ fontSize: 40 }} />,
      subcategories: [
        {
          title: 'Basic Electronics',
          tools: [
            {
              title: "Ohm's Law Calculator",
              description: "Calculate voltage, current, and resistance using Ohm's Law",
              icon: <MdiToolIcon path={mdiOmega} size={1} />,
              path: '/electronic-tools/ohms-law',
            },
            {
              title: "LED Series Resistor Calculator",
              description: "Calculate the required series resistor for LED circuits",
              icon: <MdiToolIcon path={mdiLedOn} size={1} />,
              path: '/electronic-tools/led-resistor',
            },
            {
              title: "Resistor Value Decoder",
              description: "Decode resistor color codes and calculate resistance values",
              icon: <MdiToolIcon path={mdiMathNormBox} size={1} />,
              path: '/electronic-tools/resistor-calculator',
            },
            {
              title: "Voltage Divider Calculator",
              description: "Calculate output voltage and resistor values for voltage dividers",
              icon: <MdiToolIcon path={mdiDivision} size={1} />,
              path: '/electronic-tools/voltage-divider',
            },
            {
              title: "Capacitor Calculator",
              description: "Analyze capacitor charging and discharging behavior",
              icon: <MdiToolIcon path={mdiChartBellCurveCumulative} size={1} />,
              path: '/electronic-tools/capacitor-calculator',
            },
            {
              title: "ADC Calculator",
              description: "Design voltage dividers for ADC inputs and analyze measurement ranges",
              icon: <AdcIcon />,
              path: '/electronic-tools/adc-calculator',
            },
          ],
        },
        {
          title: 'Advanced Electronics',
          tools: [
            {
              title: "RC Filter Calculator",
              description: "Design and analyze RC low-pass and high-pass filters",
              icon: <MdiToolIcon path={mdiChartSankey} size={1} />,
              path: '/electronic-tools/rc-filter',
            },
            {
              title: "Reactance Calculator",
              description: "Calculate reactance for inductors and capacitors",
              icon: <MdiToolIcon path={mdiChartBellCurve} size={1} />,
              path: '/electronic-tools/reactance',
            },
          ],
        },
        {
          title: 'Power Electronics',
          tools: [
            {
              title: "Battery Life Calculator",
              description: "Estimate battery life based on load current and battery capacity",
              icon: <MdiToolIcon path={mdiBatteryUnknown} size={1} />,
              path: '/electronic-tools/battery-life',
            },
            {
              title: "Voltage Regulator Calculator",
              description: "Calculate power dissipation and efficiency for linear regulators",
              icon: <RegulatorIcon />,
              path: '/electronic-tools/voltage-regulator',
            },
          ],
        },
        {
          title: 'PCB Design',
          tools: [
            {
              title: "PCB Trace Calculator",
              description: "Calculate minimum trace width for PCB design",
              icon: <PcbIcon />,
              path: '/electronic-tools/pcb-trace',
            },
          ],
        },
      ],
    },
    {
      title: 'Code Dev Tools',
      description: 'Essential utilities for software development and debugging.',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      subcategories: [
        {
          title: 'Development Tools',
          tools: [
            {
              title: "Serial Terminal",
              description: "Monitor and analyze serial communication",
              icon: <TerminalIcon />,
              path: '/software-tools/serial-terminal',
            },
            {
              title: "Modbus Terminal",
              description: "Communicate with Modbus RTU devices",
              icon: <ModbusIcon />,
              path: '/software-tools/modbus-terminal',
            },
            {
              title: "Regex Tester",
              description: "Test and debug regular expressions with real-time matching",
              icon: <RegexIcon />,
              path: '/software-tools/regex-tester',
            },
            {
              title: "JSON Formatter",
              description: "Format, validate, and analyze JSON data structures",
              icon: <JsonIcon />,
              path: '/software-tools/json-formatter',
            },
          ],
        },
        {
          title: 'Data Conversion',
          tools: [
            {
              title: "Multi-Base Calculator",
              description: "Perform arithmetic and bitwise operations in decimal, binary, and hexadecimal",
              icon: <BaseConverterIcon />,
              path: '/software-tools/base-converter',
            },
            {
              title: "Byte Converter",
              description: "Convert between raw bytes and various numeric types (integers, floats)",
              icon: <MdiToolIcon path={mdiSwapHorizontal} size={1} />,
              path: '/software-tools/byte-converter',
            },
            {
              title: "Binary Viewer",
              description: "View and analyze binary data in multiple formats",
              icon: <MagnifyIcon />,
              path: '/software-tools/binary-viewer',
            },
          ],
        },
        {
          title: 'Media & Graphics',
          tools: [
            {
              title: "Color Picker",
              description: "Select and convert colors between different formats",
              icon: <ColorPickerIcon />,
              path: '/software-tools/color-picker',
            },
            {
              title: "Image Converter",
              description: "Convert images between different formats and analyze image data",
              icon: <ImageConverterIcon />,
              path: '/software-tools/image-converter',
            },
          ],
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Welcome to Tech Toolbox
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Your comprehensive suite of tools for electronic design and software development
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {categories.map((category, index) => (
          <Grid item xs={12} key={index}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {category.icon}
                <Box sx={{ ml: 2 }}>
                  <CategoryTitle variant="h4" component="h2">
                    {category.title}
                  </CategoryTitle>
                  <Typography variant="subtitle1" color="text.secondary">
                    {category.description}
                  </Typography>
                </Box>
              </Box>
              
              {category.subcategories.map((subcategory) => (
                <Box key={subcategory.title} sx={{ mb: 4 }}>
                  <SubcategoryTitle variant="h6">
                    {subcategory.title}
                  </SubcategoryTitle>
                  <Grid container spacing={2}>
                    {subcategory.tools.map((tool) => (
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
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
