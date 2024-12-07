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
  FilterAlt as FilterIcon,
  Tune as ReactanceIcon,
  Memory as PcbIcon,
  PowerInput as RegulatorIcon,
  DataObject as AdcIcon,
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
  mdiBatteryUnknown
} from '@mdi/js';
import OhmsLawCalculator from '../tools/electronic/OhmsLawCalculator';
import LedResistorCalculator from '../tools/electronic/LedResistorCalculator';
import ResistorColorCalculator from '../tools/electronic/ResistorColorCalculator';
import CapacitorCalculator from '../tools/electronic/CapacitorCalculator';
import VoltageDividerCalculator from '../tools/electronic/VoltageDividerCalculator';
import RcFilterCalculator from '../tools/electronic/RcFilterCalculator';
import ReactanceCalculator from '../tools/electronic/ReactanceCalculator';
import PcbTraceCalculator from '../tools/electronic/PcbTraceCalculator';
import BatteryLifeCalculator from '../tools/electronic/BatteryLifeCalculator';
import VoltageRegulatorCalculator from '../tools/electronic/VoltageRegulatorCalculator';
import AdcCalculator from '../tools/electronic/AdcCalculator';

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

const ElectronicTools = () => {
  const categories = [
    {
      title: "Basic Electronics",
      tools: [
        {
          title: "Ohm's Law Calculator",
          description: "Calculate voltage, current, and resistance using Ohm's Law",
          path: "ohms-law",
          component: OhmsLawCalculator,
          icon: <MdiToolIcon path={mdiOmega} size={1} />,
        },
        {
          title: "LED Series Resistor Calculator",
          description: "Calculate the required series resistor for LED circuits",
          path: "led-resistor",
          component: LedResistorCalculator,
          icon: <MdiToolIcon path={mdiLedOn} size={1} />,
        },
        {
          title: "Resistor Value Decoder",
          description: "Decode resistor color codes and calculate resistance values",
          path: "resistor-calculator",
          component: ResistorColorCalculator,
          icon: <MdiToolIcon path={mdiMathNormBox} size={1} />,
        },
        {
          title: "Voltage Divider Calculator",
          description: "Calculate output voltage and resistor values for voltage dividers",
          path: "voltage-divider",
          component: VoltageDividerCalculator,
          icon: <MdiToolIcon path={mdiDivision} size={1} />,
        },
        {
          title: "Capacitor Calculator",
          description: "Analyze capacitor charging and discharging behavior",
          path: "capacitor-calculator",
          component: CapacitorCalculator,
          icon: <MdiToolIcon path={mdiChartBellCurveCumulative} size={1} />,
        },
        {
          title: "ADC Calculator",
          description: "Design voltage dividers for ADC inputs and analyze measurement ranges",
          path: "adc-calculator",
          component: AdcCalculator,
          icon: <AdcIcon />,
        },
      ],
    },
    {
      title: "Advanced Electronics",
      tools: [
        {
          title: "RC Filter Calculator",
          description: "Design and analyze RC low-pass and high-pass filters",
          path: "rc-filter",
          component: RcFilterCalculator,
          icon: <MdiToolIcon path={mdiChartSankey} size={1} />,
        },
        {
          title: "Reactance Calculator",
          description: "Calculate reactance for inductors and capacitors",
          path: "reactance",
          component: ReactanceCalculator,
          icon: <MdiToolIcon path={mdiChartBellCurve} size={1} />,
        },
      ],
    },
    {
      title: "Power Electronics",
      tools: [
        {
          title: "PCB Trace Calculator",
          description: "Calculate minimum trace width for PCB design",
          path: "pcb-trace",
          component: PcbTraceCalculator,
          icon: <PcbIcon />,
        },
        {
          title: "Battery Life Calculator",
          description: "Estimate battery life based on load current and battery capacity",
          path: "battery-life",
          component: BatteryLifeCalculator,
          icon: <MdiToolIcon path={mdiBatteryUnknown} size={1} />,
        },
        {
          title: "Voltage Regulator Calculator",
          description: "Calculate power dissipation and efficiency for linear regulators",
          path: "voltage-regulator",
          component: VoltageRegulatorCalculator,
          icon: <RegulatorIcon />,
        },
      ],
    },
  ];

  // Main tools listing page
  const ToolsList = () => (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <CategoryTitle variant="h3" component="h1" gutterBottom>
          Electronic Tools
        </CategoryTitle>
        <Typography variant="h6" color="text.secondary" paragraph>
          Essential calculators for electronic design and analysis
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

export default ElectronicTools;
